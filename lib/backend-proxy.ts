type ProxyOptions = {
  origin?: string;
  bearer?: string;
  proxySecret?: string;
  fetchImpl?: typeof fetch;
};

const allowedPath = /^\/api\/(?:auth\/(?:session|setup|login|logout)|content|calendar|guests|my-rsvp|pass|music|photos(?:\/[a-f0-9-]{36})?|admin(?:\/content|\/passwords|\/guests\/[a-f0-9-]{36}|\/photos\/[a-f0-9-]{36})?|scan\/(?:lookup|search|checkin))$/;
const writeMethods = new Set(['POST', 'PATCH', 'DELETE']);
const maxBodyBytes = 4_000_000;

function error(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function proxyWeddingRequest(req: Request, options: ProxyOptions): Promise<Response> {
  const incoming = new URL(req.url);
  if (!allowedPath.test(incoming.pathname)) return error('Page not found.', 404);
  if (writeMethods.has(req.method) && req.headers.get('origin') !== incoming.origin) {
    return error('Please use the wedding website to complete this action.', 403);
  }
  if (!options.origin || !options.bearer || !options.proxySecret) {
    return error('The wedding details are temporarily unavailable. Please try again.', 503);
  }
  const backend = new URL(options.origin);
  if (backend.protocol !== 'https:') return error('The wedding details are temporarily unavailable.', 503);
  const destination = new URL(incoming.pathname + incoming.search, backend.origin);
  const headers = new Headers({ 'OAI-Sites-Authorization': 'Bearer ' + options.bearer, 'Origin': backend.origin });
  for (const name of ['content-type', 'x-guest-token']) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }
  const cookies = (req.headers.get('cookie') || '').split(';').map(x => x.trim()).filter(x => /^bb_(admin|usher|guest)=/.test(x));
  if (cookies.length) headers.set('cookie', cookies.join('; '));

  // Vercel replaces x-forwarded-for. Sign it so the backend only trusts our proxy.
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const timestamp = String(Date.now());
  const message = `${timestamp}:${clientIp}:${req.method}:${incoming.pathname}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(options.proxySecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  headers.set('x-bb-proxy-ip', clientIp);
  headers.set('x-bb-proxy-time', timestamp);
  headers.set('x-bb-proxy-signature', Array.from(new Uint8Array(signature), x => x.toString(16).padStart(2, '0')).join(''));

  if (Number(req.headers.get('content-length') || 0) > maxBodyBytes) return error('Please choose a smaller photo.', 413);
  const body = writeMethods.has(req.method) ? await req.arrayBuffer() : undefined;
  if (body && body.byteLength > maxBodyBytes) return error('Please choose a smaller photo.', 413);
  try {
    const response = await (options.fetchImpl || fetch)(destination, {
      method: req.method, headers, body, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(25000),
    });
    const contentType = response.headers.get('content-type') || '';
    if (!/^(application\/json|text\/calendar|image\/)/.test(contentType)) {
      return error('The wedding details are temporarily unavailable. Please try again.', 503);
    }
    const output = new Headers({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    for (const name of ['content-type', 'content-disposition']) {
      const value = response.headers.get(name);
      if (value) output.set(name, value);
    }
    for (const cookie of response.headers.getSetCookie()) {
      if (/^bb_(admin|usher|guest)=/.test(cookie)) output.append('set-cookie', cookie);
    }
    return new Response(response.body, { status: response.status, headers: output });
  } catch {
    return error('We couldn’t complete that just now. Please try again.', 503);
  }
}

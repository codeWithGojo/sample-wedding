import { proxyWeddingRequest } from '@/lib/backend-proxy';
import { defaultContent } from '@/app/content';
import { buildWeddingCalendar, validReminder } from '@/app/calendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

function handle(req: Request) {
  const configured = Boolean(process.env.WEDDING_API_ORIGIN && process.env.WEDDING_API_BEARER && process.env.WEDDING_PROXY_SECRET);
  const pathname = new URL(req.url).pathname;
  // The public invitation remains usable before the private guest service is connected.
  // Configured deployments always use the backend, including its invitation gate.
  if (!configured && req.method === 'GET' && pathname === '/api/content') {
    return Response.json({ content: defaultContent, backendAvailable: false }, { headers: { 'Cache-Control': 'no-store' } });
  }
  // The event is public and must open in a calendar even if the guest service is offline.
  if (req.method === 'GET' && pathname === '/api/calendar') {
    const query=new URL(req.url).searchParams;
    const disposition=query.get('download')==='1'?'attachment':'inline';
    return new Response(buildWeddingCalendar(validReminder(query.get('reminder'))), {
      headers: {'Content-Type':'text/calendar; charset=utf-8',
        'Content-Disposition':disposition+'; filename="blessing-wedding-12-dec-2026.ics"',
        'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'},
    });
  }
  return proxyWeddingRequest(req, {
    origin: process.env.WEDDING_API_ORIGIN,
    bearer: process.env.WEDDING_API_BEARER,
    proxySecret: process.env.WEDDING_PROXY_SECRET,
  });
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;

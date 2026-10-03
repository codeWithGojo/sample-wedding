import { proxyWeddingRequest } from '@/lib/backend-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

function handle(req: Request) {
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

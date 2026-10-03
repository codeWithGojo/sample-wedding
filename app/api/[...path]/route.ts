import { proxyWeddingRequest } from '@/lib/backend-proxy';
import { defaultContent, venueName, venueAddress } from '@/app/content';

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
  if (!configured && req.method === 'GET' && pathname === '/api/calendar') {
    const escape = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const calendar = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Blessing and Blessing//Wedding//EN', 'BEGIN:VEVENT',
      'UID:blessing-and-blessing-20261212', 'DTSTAMP:' + stamp, 'DTSTART:20261212T100000Z',
      'SUMMARY:Blessing & Blessing — Traditional Marriage', 'LOCATION:' + escape(venueName + ', ' + venueAddress),
      'DESCRIPTION:Traditional marriage. 11am prompt. #BlessingFoundHerBlessing26', 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
    return new Response(calendar, { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'attachment; filename="blessing-wedding.ics"', 'Cache-Control': 'no-store' } });
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

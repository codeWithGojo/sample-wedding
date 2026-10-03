# Blessing & Blessing — Vercel deployment

This copy runs the wedding pages on standard Next.js and Vercel. The existing private wedding backend remains responsible for the single guest list, approvals, QR entry, music requests, organiser access and moderated photo storage.

The design, family copy, supplied photographs and calendar button are preserved. The shareable QR opens `/guest` for directions, RSVP with an optional song title and artist, and the photo page. Its address contains no personal guest token. Personal entry QRs stay on private RSVP pages. Guest uploads open on the wedding day unless the family opens them earlier, and every guest photo waits for approval. Guest management links keep their private token in the URL fragment. Backend credentials never appear in browser code.

## Deploy

1. Set the three server-only variables shown in `.env.example` in Vercel. Do not prefix these with `NEXT_PUBLIC_`.
2. Set the matching `WEDDING_PROXY_SECRET` on the existing backend and deploy its trusted-proxy update.
3. Use a protected preview while the invitation is being reviewed. Keep deployment protection enabled until the owner authorises guest access.
4. Deploy with the Next.js framework preset. `npm run build` produces the Vercel-compatible application.

`NEXT_PUBLIC_SITE_URL` is optional until the final domain is connected. Without it, link previews use Vercel's deployment URL. The calendar continues to download the event at 11am West Africa Time on 12 December 2026.

The existing backend must remain online. This is a frontend hosting move, not a database migration. Do not delete its guest list or photo bucket. The service credential and shared proxy secret must be configured again for future deployments if they are not saved as project environment variables.

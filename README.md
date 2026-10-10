# Blessing & Blessing — Vercel deployment

This copy runs the wedding pages on standard Next.js and Vercel. The existing private wedding backend remains responsible for the single guest list, approvals, QR entry, music requests, organiser access and moderated photo storage.

The design, family copy, supplied photographs and calendar button are preserved. The shareable QR opens `/guest` for directions, RSVP with an optional song title and artist, and the photo page. Its address contains no personal guest token. Personal entry QRs stay on private RSVP pages. Guest uploads open on the wedding day unless the family opens them earlier, and every guest photo waits for approval. Guest management links keep their private token in the URL fragment. Backend credentials never appear in browser code.

Entrance passes and wedding photo sharing currently show “Coming soon” placeholders, at the owner's request. Both are linked from the welcome page; entrance passes also have `/entry`, and the album has `/photographs`. The feature switches in `app/wedding-extras.tsx` are both disabled. Enable them only when the family is ready, with the existing backend configured. Guest approval and photo moderation still apply after activation.

Without all three backend environment variables, the public content and calendar endpoints serve the supplied invitation details and event locally. Online RSVP shows an opening-soon message and cannot submit. No guest data is stored in this mode. Once configured, all requests use the existing backend, preserving its invitation password and guest controls.

## Deploy

1. Set the three server-only variables shown in `.env.example` in Vercel. Do not prefix these with `NEXT_PUBLIC_`.
2. Set the matching `WEDDING_PROXY_SECRET` on the existing backend and deploy its trusted-proxy update.
3. Use a protected preview while the invitation is being reviewed. Keep deployment protection enabled until the owner authorises guest access.
4. Deploy with the Next.js framework preset. `npm run build` produces the Vercel-compatible application.

`NEXT_PUBLIC_SITE_URL` is optional until the final domain is connected. Without it, link previews use Vercel's deployment URL. The calendar continues to download the event at 11am West Africa Time on 12 December 2026.

The existing backend must remain online. This is a frontend hosting move, not a database migration. Do not delete its guest list or photo bucket. The service credential and shared proxy secret must be configured again for future deployments if they are not saved as project environment variables.

## Wedding site update — 10 October 2026

The site now uses #BlessingFoundHerBlessing. RSVP, gift and entrance-pass pages have been removed; their old URLs return to the welcome page. Menus, guest information, sharing and calendar copy have been updated. Existing private family records and the photo feature settings are preserved.

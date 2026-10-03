import type { Metadata } from 'next';
import Wedding from '../wedding';

export const metadata: Metadata = { title: 'RSVP | Blessing & Blessing' };
export default function Page() { return <Wedding page="rsvp"/>; }

import type { Metadata } from 'next';
import Wedding from '../wedding';

export const metadata: Metadata = { title: 'For Our Guests | Blessing & Blessing' };
export default function Page() { return <Wedding page="guest"/>; }

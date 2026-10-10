import type { Metadata } from 'next';
import Wedding from '../wedding';

export const metadata: Metadata = { title: 'For Our Guests | #BlessingFoundHerBlessing' };
export default function Page() { return <Wedding page="guest"/>; }

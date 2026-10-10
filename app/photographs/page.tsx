import type { Metadata } from 'next';
import Wedding from '../wedding';

export const metadata: Metadata = { title: 'Photographs | #BlessingFoundHerBlessing' };
export default function Page() { return <Wedding page="photographs"/>; }

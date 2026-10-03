import type { Metadata } from 'next';
import Wedding from '../wedding';

export const metadata: Metadata = { title: 'Travel & Stay | Blessing & Blessing · Ughelli' };
export default function Page() { return <Wedding page="travel"/>; }

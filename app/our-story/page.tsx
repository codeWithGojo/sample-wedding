import type { Metadata } from 'next';
import Wedding from '../wedding';

export const metadata: Metadata = { title: 'Our Story | Blessing & Blessing' };
export default function Page() { return <Wedding page="story"/>; }

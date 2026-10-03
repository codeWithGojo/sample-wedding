import type { Metadata } from 'next';
import Wedding from '../wedding';

export const metadata: Metadata = { title: 'The Day | Blessing & Blessing · 12 December 2026' };
export default function Page() { return <Wedding page="day"/>; }

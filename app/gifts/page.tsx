import type { Metadata } from 'next';
import Wedding from '../wedding';

export const metadata: Metadata = { title: 'A Note from Us | Blessing & Blessing' };
export default function Page() { return <Wedding page="gifts"/>; }

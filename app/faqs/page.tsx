import type { Metadata } from 'next';
import Wedding from '../wedding';

export const metadata: Metadata = { title: 'FAQs | #BlessingFoundHerBlessing' };
export default function Page() { return <Wedding page="faqs"/>; }

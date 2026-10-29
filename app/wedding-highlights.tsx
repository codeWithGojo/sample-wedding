"use client";

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import WeddingCalendar from './wedding-calendar';
import { Reveal } from './wedding-motion';
import { storyImages } from './love-story';

export function WeddingCountdown({countdown}:{countdown:number|null}) {
  const reduce=useReducedMotion();
  const values=countdown===null?['—','—','—']:[Math.floor(countdown/86400000),Math.floor(countdown%86400000/3600000),Math.floor(countdown%3600000/60000)];
  return <section className="wedding-countdown" aria-label="Countdown to the wedding"><div className="countdown-date"><span>Save us a Saturday.</span><h2>12 December 2026</h2><p>11am prompt · Ughelli</p></div><div className="countdown-clock" aria-label={countdown===0?'The day is here':values[0]+' days until the celebration'}>{values.map((value,index)=><div key={index}><motion.span key={String(value)} initial={false} animate={reduce?{}:{opacity:[.5,1],y:[4,0]}} transition={{duration:.25}}>{String(value).padStart(2,'0')}</motion.span><small>{['Days','Hours','Minutes'][index]}</small></div>)}</div><WeddingCalendar className="button countdown-calendar" label="Add to my calendar"/></section>;
}
export function PhotoInterlude() {
 return <section className="photo-interlude" aria-labelledby="photo-interlude-heading">
   <Reveal className="interlude-heading"><div><p className="stationery-label">In our own little world</p><h2 id="photo-interlude-heading">Life, with you.</h2></div><Link href="/photographs">View our photographs <ArrowUpRight size={17}/></Link></Reveal>
   <div className="photo-editorial">
     <Reveal className="editorial-main"><Link className="editorial-photo-link" href="/photographs" aria-label="View the photograph of Blessing and Blessing laughing together"><figure><img src={storyImages[1].src} width={1025} height={1534} alt={storyImages[1].alt} loading="lazy"/><figcaption>The laughter. The little moments. The love.</figcaption></figure></Link></Reveal>
     <Reveal className="editorial-secondary" delay={.08}><Link className="editorial-photo-link" href="/photographs" aria-label="View the photograph of Blessing and Blessing smiling at each other"><figure><img src={storyImages[2].src} width={1025} height={1534} alt={storyImages[2].alt} loading="lazy"/><figcaption>Every tomorrow, together.</figcaption></figure></Link><blockquote>From “I don’t hug strangers”<br/>to “I do.”</blockquote><span className="editorial-signature">Blessing &amp; Blessing</span></Reveal>
   </div>
 </section>;
}

"use client";

import Link from 'next/link';
import { ArrowUpRight, Heart } from 'lucide-react';
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
 return <section className="photo-interlude"><Reveal className="interlude-heading"><div><span className="small-label">In our own little world</span><h2>The little moments<br/>that became everything.</h2></div><Link href="/photographs">View our photographs <ArrowUpRight size={17}/></Link></Reveal><div className="photo-interlude-grid">{[storyImages[1],storyImages[2],storyImages[0]].map((photo,index)=><Reveal key={photo.src} delay={index*.06}><Link href="/photographs" aria-label="View our photographs"><figure><img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy"/><figcaption>{['The laughter.','The way you look at me.','Just us.'][index]}<Heart size={14}/></figcaption></figure></Link></Reveal>)}</div></section>;
}

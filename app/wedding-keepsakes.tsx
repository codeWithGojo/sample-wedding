"use client";

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';

export function DateKeepsake() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const cells = useRef(new Set<string>());
  const last = useRef<{x:number;y:number}|null>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = canvas.current;
    if (!el || revealed) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    const gradient = ctx.createLinearGradient(0, 0, 640, 260);
    gradient.addColorStop(0, '#681a30'); gradient.addColorStop(1, '#421020');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 640, 260);
    ctx.strokeStyle = '#c6a77a'; ctx.lineWidth = 2; ctx.strokeRect(14, 14, 612, 232);
    ctx.fillStyle = '#fff3e5'; ctx.textAlign = 'center';
    ctx.font = '30px Georgia'; ctx.fillText('A date to keep', 320, 115);
    ctx.font = '17px Arial'; ctx.fillText('Scratch here to reveal', 320, 154);
  }, [revealed]);
  function scratch(e: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const el = e.currentTarget, box = el.getBoundingClientRect(), ctx = el.getContext('2d');
    if (!ctx) return;
    const x = (e.clientX-box.left)*640/box.width, y = (e.clientY-box.top)*260/box.height;
    ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = 58; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(last.current?.x ?? x, last.current?.y ?? y); ctx.lineTo(x,y); ctx.stroke();
    ctx.beginPath(); ctx.arc(x,y,29,0,Math.PI*2); ctx.fill(); last.current={x,y};
    cells.current.add(`${Math.floor(x/32)}:${Math.floor(y/26)}`);
    if(cells.current.size>35){drawing.current=false;setRevealed(true);}
  }
  return <section className="section keepsake-section" aria-labelledby="keepsake-heading">
    <div><p className="keepsake-eyebrow">Keep this little moment</p><h2 id="keepsake-heading">The next chapter<br/>has a date.</h2><p>One day. Two families. All the people we love.</p><p>Run your finger across the card, or tap the button below.</p></div>
    <div className="keepsake-wrap"><div className={'date-keepsake '+(revealed?'is-revealed':'')}><div className="keepsake-date"><span>Saturday</span><strong>12 December 2026</strong><span>11am prompt · Ughelli</span></div>{!revealed&&<canvas ref={canvas} width={640} height={260} aria-hidden="true" onPointerDown={e=>{drawing.current=true;last.current=null;e.currentTarget.setPointerCapture(e.pointerId);scratch(e)}} onPointerMove={scratch} onPointerUp={()=>{drawing.current=false;last.current=null}} onPointerCancel={()=>{drawing.current=false;last.current=null}}/>}</div><div className="keepsake-controls">{!revealed?<button className="text-button" onClick={()=>setRevealed(true)}>Reveal the date</button>:<p role="status">It’s a date. We’ll see you there.</p>}<a className="text-link" href="/api/calendar">Save to calendar ↗</a></div></div>
  </section>;
}

export function FamilyInvitation() {
 return <section className="family-invitation" aria-labelledby="family-invite-title"><p className="keepsake-eyebrow">Together with our families</p><div className="family-invitation-rule" aria-hidden="true"/><h2 id="family-invite-title">The Awhefeada <span>&amp;</span> Toka families</h2><p>With grateful hearts, we invite you to celebrate the traditional marriage of</p><div className="invitation-couple"><span>Blessing Egokiniovo<small>Awhefeada Esq.</small></span><i aria-hidden="true">&amp;</i><span>Blessing Oshevire<small>Engr. Blessing Oshevire Toka</small></span></div><p>Saturday, 12 December 2026 · 11am prompt</p><Link className="family-invitation-link" href="/the-day">Come celebrate with us <span aria-hidden="true">↗</span></Link></section>;
}

export function StoryPrelude(){
 return <section className="story-prelude"><figure><img src="/couple/together.webp" alt="Blessing and Blessing together" width={810} height={1440} loading="lazy"/><figcaption>23 December 2023 — the beginning</figcaption></figure><div><p className="keepsake-eyebrow">A little of our story</p><h2>It started<br/>with Onos.</h2><p>An ordinary meeting. A mutual friend. Neither of us knew we were meeting the person we would choose for every tomorrow.</p><Link className="text-link" href="/our-story">Read our story, chapter by chapter ↗</Link></div></section>;
}

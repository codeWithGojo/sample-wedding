"use client";

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Images, MoveUpRight } from 'lucide-react';

export default function WeddingMobileInvitation({ active, onRead, onEnter }: {
  active: boolean;
  onRead: () => void;
  onEnter: () => void;
}) {
  const [ready, setReady] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const held = useRef(false);

  function cancelHold() {
    clearTimeout(holdTimer.current);
    holdTimer.current = undefined;
    origin.current = null;
  }

  useEffect(() => {
    if (!active) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timeout = setTimeout(() => setReady(true), motion.matches ? 0 : 6400);
    return () => { clearTimeout(timeout); cancelHold(); };
  }, [active]);

  function beginHold(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    cancelHold();
    held.current = false;
    origin.current = { x: event.clientX, y: event.clientY };
    holdTimer.current = setTimeout(() => {
      held.current = true;
      cancelHold();
      onRead();
    }, 350);
  }

  function moveHold(event: PointerEvent<HTMLButtonElement>) {
    if (origin.current && Math.hypot(event.clientX - origin.current.x, event.clientY - origin.current.y) > 12) cancelHold();
  }

  return <section className={'mobile-invitation ' + (active ? 'mobile-film-running ' : '') + (ready ? 'mobile-film-ready' : '')} aria-label="Our wedding invitation">
    <div className="mobile-invitation-stage">
      <div className="mobile-room" aria-hidden="true"/>
      <div className="mobile-table" aria-hidden="true"><div className="mobile-table-cloth"/><div className="mobile-table-runner"/></div>
      <figure className="mobile-couple-photo"><img src="/couple/laughter.webp" width="960" height="1280" alt="Blessing Egohiniovo and Blessing Oshewire together" fetchPriority="high" draggable={false}/><div className="mobile-photo-frame" aria-hidden="true"/></figure>
      <div className="mobile-card-placement" inert={!ready} aria-hidden={!ready}>
        <button className="mobile-invitation-card" aria-label="Hold or tap to read our wedding invitation" aria-describedby="mobile-card-hint"
          onPointerDown={beginHold} onPointerMove={moveHold} onPointerUp={cancelHold} onPointerCancel={cancelHold} onPointerLeave={cancelHold}
          onContextMenu={event => event.preventDefault()}
          onClick={event => { cancelHold(); if (!held.current || event.detail === 0) onRead(); held.current = false; }}>
          <img src="/invitation.jpg" width="850" height="1203" alt="The Awhefeada and Toka families’ traditional marriage invitation" fetchPriority="high" draggable={false}/>
        </button>
        <p id="mobile-card-hint"><MoveUpRight size={14}/> Hold the card to read</p>
      </div>
      <button className="mobile-film-skip" onClick={() => setReady(true)} hidden={ready}>Skip the motion <ArrowRight size={13}/></button>
    </div>
    <div className="mobile-invitation-footer" inert={!ready} aria-hidden={!ready}>
      <p>12 December 2026 · Ughelli</p>
      <div className="scene-actions"><button onClick={onEnter}>Enter the site <ArrowRight size={17}/></button><Link href="/photographs"><Images size={17}/> Gallery</Link></div>
      <button className="mobile-read-alternative" onClick={onRead}>Read the invitation</button>
    </div>
  </section>;
}

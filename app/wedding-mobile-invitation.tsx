"use client";

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Images, Mail, Pause, Play } from 'lucide-react';

export default function WeddingMobileInvitation({ active, onRead, onEnter }: {
  active: boolean;
  onRead: () => void;
  onEnter: () => void;
}) {
  const [view, setView] = useState<'tour' | 'table'>('tour');
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const camera = useRef<HTMLDivElement>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cameraFrames = useRef<number[]>([]);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const held = useRef(false);
  const pointerSession = useRef<{ id: number; surface: HTMLElement } | null>(null);

  function clearHold() {
    clearTimeout(holdTimer.current);
    holdTimer.current = undefined;
    origin.current = null;
  }

  function releaseHold() {
    clearHold();
    const session = pointerSession.current;
    pointerSession.current = null;
    if (session?.surface.hasPointerCapture(session.id)) session.surface.releasePointerCapture(session.id);
    setHolding(false);
  }

  useEffect(() => {
    if (!active) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyPreference = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) { setView('table'); releaseHold(); }
    };
    applyPreference();
    preference.addEventListener('change', applyPreference);
    const onHide = () => { if (document.hidden) releaseHold(); };
    window.addEventListener('blur', releaseHold);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      clearHold();
      pointerSession.current = null;
      cameraFrames.current.forEach(cancelAnimationFrame);
      preference.removeEventListener('change', applyPreference);
      window.removeEventListener('blur', releaseHold);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [active]);

  function focusTable() {
    if (view === 'table') return;
    const scene = camera.current;
    if (scene && !reducedMotion) {
      // Keep the current camera position when leaving the moving tour.
      const position = getComputedStyle(scene);
      scene.style.transform = position.transform;
      scene.style.transformOrigin = position.transformOrigin;
      cameraFrames.current.forEach(cancelAnimationFrame);
      cameraFrames.current = [requestAnimationFrame(() => {
        cameraFrames.current.push(requestAnimationFrame(() => {
          scene.style.transform = '';
          scene.style.transformOrigin = '';
        }));
      })];
    }
    setView('table');
  }

  function beginHold(event: PointerEvent<HTMLElement>) {
    const control = (event.target as Element).closest('button, a');
    if (control && !control.classList.contains('mobile-invitation-card') && !control.classList.contains('mobile-hold-control')) return;
    if (!active || !event.isPrimary || event.button !== 0) return;
    event.stopPropagation();
    releaseHold();
    clearHold();
    held.current = false;
    origin.current = { x: event.clientX, y: event.clientY };
    const surface = event.currentTarget;
    const pointerId = event.pointerId;
    pointerSession.current = { id: pointerId, surface };
    surface.setPointerCapture(pointerId);
    holdTimer.current = setTimeout(() => {
      if (pointerSession.current?.id !== pointerId) return;
      held.current = true;
      clearHold();
      focusTable();
      setHolding(true);
    }, 250);
  }

  function moveHold(event: PointerEvent<HTMLElement>) {
    if (event.pointerId !== pointerSession.current?.id) return;
    if (origin.current && Math.hypot(event.clientX - origin.current.x, event.clientY - origin.current.y) > 24) {
      held.current = true;
      clearHold();
    }
  }

  function endHold(event: PointerEvent<HTMLElement>) {
    if (event.pointerId === pointerSession.current?.id) releaseHold();
  }

  function readInvitation() { focusTable(); onRead(); }

  return <section className={'mobile-invitation ' + (active ? 'mobile-film-running ' : '') + 'mobile-view-' + view + (holding ? ' mobile-card-held' : '')} aria-label="Our wedding invitation">
    <div className="mobile-invitation-stage" onPointerDown={beginHold} onPointerMove={moveHold} onPointerUp={endHold} onPointerCancel={endHold} onLostPointerCapture={endHold} onContextMenu={event => event.preventDefault()}>
      <div ref={camera} className="mobile-scene-camera" style={{ animationPlayState: paused || !active ? 'paused' : 'running' }}>
        <div className="mobile-room" aria-hidden="true"/>
        <div className="mobile-scene-monogram" aria-hidden="true"><span>#Blessing<wbr/>FoundHer<wbr/>Blessing</span><small>12 December 2026</small></div>
        <figure className="mobile-couple-photo"><div className="mobile-photo-frame"><img src="/couple/laughter.webp" width="960" height="1280" alt="Blessing Egokiniovo and Blessing Oshevire together" fetchPriority="high" draggable={false}/></div><figcaption>From 23 December, to forever.</figcaption></figure>
        <div className="mobile-console" aria-hidden="true"><div className="mobile-console-top"/><div className="mobile-console-drawer"/><div className="mobile-console-drawer"/></div>
        <div className="mobile-card-placement">
          <button className="mobile-invitation-card" aria-label="Read our wedding invitation" aria-describedby="mobile-card-hint" onFocus={focusTable}
            onPointerDown={beginHold} onPointerMove={moveHold} onPointerUp={endHold} onPointerCancel={endHold} onLostPointerCapture={endHold}
            onClick={event => { if (!held.current || event.detail === 0) readInvitation(); held.current = false; }}>
            <img src="/invitation.jpg" width="850" height="1203" alt="The Awhefeada and Toka families’ traditional marriage invitation" fetchPriority="high" draggable={false}/>
          </button>
          <div className="mobile-card-stand" aria-hidden="true"/>
        </div>
      </div>
      <div className="mobile-scene-tools">
        {view === 'table' && !reducedMotion && <button onClick={() => { setHolding(false); setView('tour'); setPaused(false); }} aria-label="Return to the couple"><ArrowLeft size={17}/></button>}
        {view === 'tour' && !reducedMotion && <button onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume the scene motion' : 'Pause the scene motion'}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button>}
      </div>
    </div>
    <span id="mobile-card-hint" className="sr-only">Hold the screen for a closer look, or tap the invitation to read.</span>
    <div className="mobile-invitation-footer">
      {view === 'tour' ? <>
        <button className="mobile-view-invitation" onClick={focusTable}><Mail size={20}/><span>View invitation</span></button>
        <button className="mobile-enter-direct" onClick={onEnter}>Enter the site <ArrowRight size={14}/></button>
      </> : <>
        <button className="mobile-hold-control" aria-pressed={holding} aria-describedby="mobile-card-hint"
          onPointerDown={beginHold} onPointerMove={moveHold} onPointerUp={endHold} onPointerCancel={endHold} onLostPointerCapture={endHold}
          onContextMenu={event => event.preventDefault()}
          onClick={event => { if (!held.current || event.detail === 0) readInvitation(); held.current = false; }}>
          {holding ? 'Release to zoom out' : 'Hold to zoom the invitation'}
        </button>
        <div className="scene-actions"><button onClick={onEnter}>Enter the main site <ArrowRight size={16}/></button><Link href="/photographs"><Images size={17}/> Gallery</Link></div>
        <button className="mobile-read-alternative" onClick={readInvitation}>Tap to read the invitation</button>
      </>}
    </div>
  </section>;
}

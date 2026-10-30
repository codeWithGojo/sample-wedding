"use client";

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Image from 'next/image';
import { Dialog } from 'radix-ui';
import { ArrowLeft, ArrowRight, Camera, Mail, Pause, Play, X, ZoomIn, ZoomOut } from 'lucide-react';
import { weddingConfig as config } from './wedding-config';

const copy = config.scene;
const approachDuration = 1100;

function InvitationPaper() {
  return <span className="scene-invitation-paper">
    <span className="scene-paper-family">{config.familyLine}</span>
    <span className="scene-paper-invite">{config.invitationLine}</span>
    <span className="scene-paper-names"><span>{config.names.bride}</span><i>&amp;</i><span>{config.names.groom}</span></span>
    <span className="scene-paper-rule" aria-hidden="true"/>
    <span className="scene-paper-date">{config.date.full}</span>
    <span className="scene-paper-time">{config.date.time}</span>
    <span className="scene-paper-venue">{config.venue.name}</span>
    <span className="scene-paper-address">{config.venue.address}</span>
    <span className="scene-paper-rsvp">{copy.rsvp}<br/>{config.rsvp.phones.join(' · ')}</span>
    <span className="scene-paper-hashtag">{config.hashtag}</span>
  </span>;
}

function Butterfly() {
  return <div className="scene-butterfly-path" aria-hidden="true"><div className="scene-butterfly-float">
    <svg viewBox="0 0 60 54" fill="none" className="scene-butterfly">
      <g className="scene-butterfly-left" fill="#dcad62" stroke="#673c28" strokeWidth="1.1"><path d="M29 28C19 3 3 2 4 17c0 11 12 13 23 13C10 27 9 47 21 45c7-2 8-11 8-17Z"/><path d="m27 27-16-12m16 16-10 7" stroke="#fff0c4"/></g>
      <g className="scene-butterfly-right" fill="#f0c480" stroke="#673c28" strokeWidth="1.1"><path d="M31 28C41 3 57 2 56 17c0 11-12 13-23 13 17-3 18 17 6 15-7-2-8-11-8-17Z"/><path d="m33 27 16-12m-16 16 10 7" stroke="#fff0c4"/></g>
      <path d="M30 18v24m0-24-5-8m5 8 5-8" stroke="#4b2e1a" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div></div>;
}

export default function WeddingScene({ active, onContinue }: {
  active: boolean;
  onContinue: (target?: 'main' | 'venue') => void;
}) {
  const [view, setView] = useState<'tour' | 'approach'>('tour');
  const [dialog, setDialog] = useState<'invite' | 'gallery' | null>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [holding, setHolding] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const root = useRef<HTMLElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const framedCard = useRef<HTMLButtonElement>(null);
  const inviteButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const pageScroll = useRef(0);
  const approachTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const held = useRef(false);
  const holdOrigin = useRef<{x: number; y: number; pointerId: number} | null>(null);
  const leaving = useRef(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduced(preference.matches);
    const updateVisibility = () => setTabVisible(!document.hidden);
    updatePreference(); updateVisibility();
    preference.addEventListener('change', updatePreference);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {threshold: 0.05});
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', updatePreference);
      document.removeEventListener('visibilitychange', updateVisibility);
      clearTimeout(approachTimer.current); clearTimeout(closeTimer.current); clearTimeout(holdTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!dialog) return;
    // Two frames let the compositor paint the opening scale before revealing it.
    let frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => setVisible(true)); });
    return () => cancelAnimationFrame(frame);
  }, [dialog]);

  useEffect(() => {
    if (!tabVisible || !active) { clearTimeout(holdTimer.current); setHolding(false); }
  }, [tabVisible, active]);

  function openInvitation() {
    if (view === 'approach' || dialog || !active) return;
    pageScroll.current = window.scrollY;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : inviteButton.current;
    const viewport = root.current?.getBoundingClientRect();
    const card = framedCard.current?.getBoundingClientRect();
    if (!reduced && viewport && card && lens.current) {
      const scale = Math.min(2.5, Math.max(1.7, viewport.height * .36 / card.height));
      const x = (viewport.left + viewport.width / 2 - card.left - card.width / 2) * scale;
      const y = (viewport.top + viewport.height * .46 - card.top - card.height / 2) * scale;
      lens.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }
    setView('approach');
    approachTimer.current = setTimeout(() => {
      setZoomed(false); setSelected(null); setDialog('invite');
    }, reduced ? 0 : approachDuration);
  }

  function releaseHold() {
    clearTimeout(holdTimer.current);
    holdOrigin.current = null;
    setHolding(false);
  }

  function closeDialog() {
    if (closing) return;
    releaseHold();
    setVisible(false); setClosing(true);
    const duration = reduced ? 0 : parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--modal-close-dur')) || 150;
    closeTimer.current = setTimeout(() => {
      setDialog(null); setClosing(false); setZoomed(false); setSelected(null); setView('tour');
      if (lens.current) lens.current.style.transform = '';
    }, duration);
  }

  function continueTo(target: 'main' | 'venue') {
    leaving.current = true;
    clearTimeout(approachTimer.current); clearTimeout(closeTimer.current); releaseHold();
    setDialog(null);
    onContinue(target);
  }

  function beginHold(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    releaseHold(); held.current = false;
    holdOrigin.current = {x: event.clientX, y: event.clientY, pointerId: event.pointerId};
    event.currentTarget.setPointerCapture(event.pointerId);
    holdTimer.current = setTimeout(() => { held.current = true; setHolding(true); }, 350);
  }

  function moveHold(event: PointerEvent<HTMLButtonElement>) {
    const start = holdOrigin.current;
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 16) {
      held.current = true;
      releaseHold();
    }
  }

  function stepPhoto(direction: number) {
    setSelected(index => index === null ? 0 : (index + direction + config.gallery.length) % config.gallery.length);
  }

  const running = active && inView && tabVisible && !reduced && !paused && view === 'tour' && !dialog;
  const photo = selected === null ? null : config.gallery[selected];

  return <>
    <section ref={root} className="wedding-scene" data-running={running} data-onscreen={inView} data-view={view} inert={!active} aria-hidden={!active} aria-label={copy.label}>
      <div className="scene-lens" ref={lens}>
        <div className="scene-panorama">
          <Image className="scene-drapes" src={copy.assets.drapes} alt="" fill sizes="250vw" loading="lazy" draggable={false}/>
          <div className="scene-floor-light" aria-hidden="true"/>
          <div className="scene-floral scene-floral-left" aria-hidden="true"><Image src={copy.assets.flowers} alt="" fill sizes="(max-width: 700px) 42vw, 24vw" loading="lazy" draggable={false}/></div>
          <div className="scene-nightstand">
            <Image src={copy.assets.nightstand} alt="" fill sizes="(max-width: 700px) 72vw, 38vw" loading="lazy" draggable={false}/>
            <button ref={framedCard} className="scene-table-card" aria-label={copy.read} onClick={openInvitation}><span aria-hidden="true"><InvitationPaper/></span></button>
          </div>
          <figure className="scene-couple"><Image src={copy.assets.couple} alt={`${config.names.together} embracing`} fill sizes="(max-width: 700px) 90vw, 48vw" loading="lazy" draggable={false}/></figure>
          <div className="scene-floral scene-floral-right" aria-hidden="true"><Image src={copy.assets.flowers} alt="" fill sizes="(max-width: 700px) 45vw, 25vw" loading="lazy" draggable={false}/></div>
          <div className="scene-floral scene-floral-front" aria-hidden="true"><Image src={copy.assets.flowers} alt="" fill sizes="(max-width: 700px) 54vw, 30vw" loading="lazy" draggable={false}/></div>
        </div>
      </div>
      <header className="scene-title"><p>{config.hashtag}</p><h1>{config.names.bride}<br/><span>&amp;</span> {config.names.groom}</h1></header>
      <Butterfly/>
      <a className="scene-skip" href="#main" onClick={event => {event.preventDefault(); continueTo('main');}}>{copy.skip}<ArrowRight size={13}/></a>
      <div className="scene-bottom-controls">
        <button className="scene-view-invitation" ref={inviteButton} id="scene-view-invitation" onClick={openInvitation} aria-haspopup="dialog" aria-expanded={dialog === 'invite'}><span className="scene-round-icon"><Mail size={25} strokeWidth={1.3}/></span><span>{copy.view}</span></button>
        <p className="scene-event-date">{config.date.short} · {config.venue.locality}</p>
      </div>
      {!reduced && <button className="scene-pause" onClick={() => setPaused(value => !value)} aria-label={paused ? copy.play : copy.pause} aria-pressed={paused}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button>}
    </section>

    <Dialog.Root open={dialog !== null} onOpenChange={open => {if (!open) closeDialog();}}>
      <Dialog.Portal>
        <Dialog.Overlay className={'scene-modal-scrim' + (visible ? ' is-visible' : '')}/>
        <Dialog.Content className={'scene-dialog t-modal ' + (visible ? 'is-open' : closing ? 'is-closing' : '') + (dialog === 'gallery' ? ' scene-gallery-dialog' : ' scene-invite-dialog')}
          onOpenAutoFocus={event => {event.preventDefault(); closeButton.current?.focus({preventScroll: true});}}
          onCloseAutoFocus={event => {event.preventDefault(); if (!leaving.current) {
            window.scrollTo({top: pageScroll.current, behavior: 'instant'});
            (returnFocus.current || inviteButton.current)?.focus({preventScroll: true});
          }}}
          onKeyDown={event => {if (dialog === 'gallery' && selected !== null) {if (event.key === 'ArrowLeft') {event.preventDefault(); stepPhoto(-1);} if (event.key === 'ArrowRight') {event.preventDefault(); stepPhoto(1);}}}}>
          <Dialog.Title className="sr-only">{dialog === 'gallery' ? copy.galleryTitle : copy.inviteTitle}</Dialog.Title>
          <Dialog.Description className="sr-only">{dialog === 'gallery' ? copy.galleryDescription : `${config.names.together}. ${config.date.full}, ${config.date.time}. ${config.venue.name}, ${config.venue.address}. ${copy.hold}.`}</Dialog.Description>
          <button ref={closeButton} className="scene-close" onClick={closeDialog}><X size={31} strokeWidth={1.2}/><span>{dialog === 'gallery' ? copy.closeGallery : copy.close}</span></button>
          {dialog === 'invite' ? <>
            <div className="scene-modal-backdrop" aria-hidden="true"><Image src={copy.assets.drapes} alt="" fill sizes="100vw" loading="lazy"/></div>
            <div className={'scene-modal-set' + (holding || zoomed ? ' scene-card-reading' : '')}>
              <Image src={copy.assets.nightstand} alt="" fill sizes="(max-width: 700px) 240vw, 1100px" loading="lazy" draggable={false}/>
              <button className="scene-table-card scene-readable-card" aria-label={holding || zoomed ? copy.zoomOut : copy.zoom} aria-pressed={holding || zoomed}
                onPointerDown={beginHold} onPointerMove={moveHold} onPointerUp={releaseHold} onPointerCancel={releaseHold} onLostPointerCapture={releaseHold}
                onContextMenu={event => event.preventDefault()}
                onClick={() => {if (!held.current) setZoomed(value => !value); held.current = false;}}><InvitationPaper/></button>
            </div>
            <div className="scene-reading-tools"><span>{copy.hold}</span><button onClick={() => setZoomed(value => !value)} aria-pressed={zoomed}>{zoomed ? <ZoomOut size={16}/> : <ZoomIn size={16}/>}<span>{zoomed ? copy.zoomOut : copy.zoom}</span></button></div>
            <div className="scene-invite-actions">
              <button className="scene-more-button" onClick={() => continueTo('venue')}>{copy.more}<ArrowRight size={15}/></button>
              <div className="scene-invite-secondary">
                <a href={config.rsvp.href} target="_blank" rel="noopener noreferrer"><span className="scene-round-icon"><Mail size={22} strokeWidth={1.3}/></span><span>{copy.rsvp}</span></a>
                <button onClick={() => {releaseHold(); setZoomed(false); setSelected(null); setDialog('gallery');}}><span className="scene-round-icon"><Camera size={22} strokeWidth={1.3}/></span><span>{copy.gallery}</span></button>
              </div>
            </div>
          </> : <div className="scene-gallery-body">
            {photo ? <>
              <button className="scene-gallery-back" onClick={() => setSelected(null)}><ArrowLeft size={17}/>{copy.backToGallery}</button>
              <figure className="scene-gallery-photo"><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 94vw, 75vw" loading="lazy" unoptimized/><figcaption>{selected! + 1} / {config.gallery.length}</figcaption></figure>
              <div className="scene-gallery-arrows"><button onClick={() => stepPhoto(-1)} aria-label={copy.previous}><ArrowLeft size={22}/></button><button onClick={() => stepPhoto(1)} aria-label={copy.next}><ArrowRight size={22}/></button></div>
            </> : <>
              <h2>{copy.gallery}</h2><p>{copy.galleryDescription}</p>
              <div className="scene-gallery-grid">{config.gallery.map((item, index) => <button key={item.src} onClick={() => setSelected(index)} aria-label={item.alt}><Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 700px) 44vw, 360px" loading="lazy" unoptimized/></button>)}</div>
            </>}
          </div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </>;
}

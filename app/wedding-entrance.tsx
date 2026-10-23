"use client";

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Images, Mail, Minus, Plus, RotateCcw } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import Wedding from './wedding';
import Link from 'next/link';
import WeddingLoader from './wedding-loader';
import { prepareInvitation } from './invitation-assets';
import WeddingMobileInvitation from './wedding-mobile-invitation';

function Rings() {
  return <svg viewBox="0 0 88 60" fill="none" aria-hidden="true"><circle cx="34" cy="34" r="20" stroke="currentColor" strokeWidth="2"/><circle cx="55" cy="34" r="20" stroke="currentColor" strokeWidth="2"/><path d="M43 14C28 4 39-3 44 4c5-7 16 0-1 10Z" fill="currentColor"/></svg>;
}

export default function WeddingEntrance() {
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [entered, setEntered] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const invitationButton = useRef<HTMLButtonElement>(null);
  const invitationViewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Old shared links must still begin with the invitation experience.
    const url = new URL(location.href);
    if (url.searchParams.has('enter')) {
      url.searchParams.delete('enter');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
    let cancelled = false;
    prepareInvitation().finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  function openCurtains() {
    setOpened(true);
    window.dispatchEvent(new Event('wedding:play-music'));
  }

  useEffect(() => {
    if (!opened || entered) return;
    const timeout = window.setTimeout(() => {
      if (window.matchMedia('(min-width: 701px)').matches) invitationButton.current?.focus({ preventScroll: true });
    }, 1450);
    return () => window.clearTimeout(timeout);
  }, [opened, entered]);

  function enterSite() {
    setLoading(false);
    setInviteOpen(false);
    setEntered(true);
    window.history.replaceState(null, '', '/' + location.hash);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  useEffect(() => {
    if (!inviteOpen || !window.matchMedia('(max-width: 700px)').matches) return;
    const frame = requestAnimationFrame(() => {
      const viewport = invitationViewport.current;
      if (viewport) {
        viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2;
        viewport.scrollTop = viewport.scrollHeight * .18;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [inviteOpen]);

  if (entered) return <><Wedding/><button className="replay-invitation" onClick={() => { setOpened(false); setEntered(false); setZoom(1); window.history.replaceState(null, '', '/' + location.hash); window.scrollTo({ top: 0 }); }}><RotateCcw size={15}/> Open the invitation again</button></>;

  return <main className={'invitation-experience ' + (opened ? 'curtains-open' : 'curtains-closed')}>
    {loading && <WeddingLoader onContinue={enterSite}/>}
    <div className={'entrance-content ' + (loading ? 'entrance-is-loading' : 'entrance-is-ready')} inert={loading} aria-hidden={loading}>
    <div className="invitation-scene" aria-hidden={!opened} inert={!opened}>
      <div className="scene-background" aria-hidden="true"/>
      <WeddingMobileInvitation active={opened && !loading} onRead={() => { setZoom(1.75); setInviteOpen(true); }} onEnter={enterSite}/>
      <div className="scene-heading"><p>The Awhefeada &amp; Toka families</p><h1>#Blessing<wbr/>FoundHer<wbr/>Blessing</h1><span>12 December 2026 · Ughelli</span></div>
      <div className="scene-tableau">
        <figure className="couple-portrait"><div className="portrait-mat"><img src="/couple/laughter.webp" width="960" height="1280" alt="Blessing Egokiniovo and Blessing Oshevire together" fetchPriority="high"/></div><figcaption>From 23 December, to forever.</figcaption></figure>
        <div className="invitation-display">
          <button ref={invitationButton} className="invitation-preview" onClick={() => { setZoom(1); setInviteOpen(true); }} aria-label="View our wedding invitation up close"><img src="/invitation.jpg" width="850" height="1203" alt="The Awhefeada and Toka families’ traditional marriage invitation" fetchPriority="high"/><span><Mail size={18}/> View invitation <Plus size={16}/></span></button>
          <div className="invitation-pedestal" aria-hidden="true"/>
        </div>
      </div>
      <div className="scene-actions"><button onClick={enterSite}>Enter the site <ArrowRight size={17}/></button><Link href="/photographs"><Images size={17}/> Gallery</Link></div>
      <p className="scene-footnote">Traditional marriage · Saturday, 12 December · 11am prompt</p>
    </div>

    <div className="curtain-panel curtain-left" aria-hidden="true"/><div className="curtain-panel curtain-right" aria-hidden="true"/><div className="curtain-valance" aria-hidden="true"/>
    {!opened && <div className="sealed-invitation"><p className="seal-overline">An invitation from our families</p><button className="champagne-seal" onClick={openCurtains} aria-label="Open the wedding invitation"><span className="seal-emboss"><Rings/><span>12 · 12 · 26</span></span></button><h1>#Blessing<wbr/>FoundHer<wbr/>Blessing</h1><p>With love, you’re invited.</p><button className="seal-caption" onClick={openCurtains}>Touch the seal to open <ArrowDown size={14}/></button></div>}
    {!opened && <button className="entrance-skip" onClick={enterSite}>Go straight to the site <ArrowRight size={15}/></button>}

    <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
      <DialogContent className="invitation-closeup" showCloseButton={false}>
        <div className="invitation-closeup-header"><div><DialogTitle>You’re invited</DialogTitle><DialogDescription>Traditional marriage · 12 December 2026</DialogDescription></div><DialogClose asChild><button className="invitation-back"><ArrowLeft size={17}/> Back</button></DialogClose></div>
        <div className="invitation-zoom-controls" aria-label="Invitation zoom controls"><button disabled={zoom <= 1} onClick={() => setZoom(z => Math.max(1, z - .25))} aria-label="Zoom out"><Minus size={18}/></button><span aria-live="polite">{Math.round(zoom * 100)}%</span><button disabled={zoom >= 2.5} onClick={() => setZoom(z => Math.min(2.5, z + .25))} aria-label="Zoom in"><Plus size={18}/></button><button onClick={() => setZoom(1)} aria-label="Reset zoom"><RotateCcw size={16}/></button></div>
        <div ref={invitationViewport} className="invitation-zoom-viewport"><div className="invitation-zoom-paper" style={{ width: `${zoom * 100}%` }}><img src="/invitation.jpg" width="850" height="1203" alt="Family invitation: Blessing Egokiniovo Awhefeada Esq. and Engr. Blessing Oshevire Toka, 12 December 2026 at 11am, Ricky’s Hotel and Event Place, Oteri, Ughelli."/></div></div>
        <div className="invitation-closeup-actions"><button onClick={enterSite}>Enter the site <ArrowRight size={17}/></button><Link href="/photographs" onClick={() => setInviteOpen(false)}><Images size={17}/> Gallery</Link></div>
      </DialogContent>
    </Dialog>
    </div>
    <noscript><style>{'.wedding-heart-loader{display:none}'}</style><div className="entrance-noscript">Open our <a href="/the-day">wedding details</a> or <a href="/photographs">gallery</a>.</div></noscript>
  </main>;
}

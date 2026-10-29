"use client";

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Mail, Minus, Plus, RotateCcw } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import Wedding from './wedding';
import Link from 'next/link';
import WeddingLoader from './wedding-loader';
import { prepareInvitation } from './invitation-assets';
import { entrancePhoto } from './love-story';

export default function WeddingEntrance() {
  const [loading, setLoading] = useState(true);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [photoFailed, setPhotoFailed] = useState(false);
  const invitationButton = useRef<HTMLButtonElement>(null);
  const entryButton = useRef<HTMLButtonElement>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const focusAfterTransition = useRef(false);

  useEffect(() => {
    const url = new URL(location.href);
    if (url.searchParams.has('enter')) {
      url.searchParams.delete('enter');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
    let cancelled = false;
    prepareInvitation().finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; clearTimeout(transitionTimer.current); };
  }, []);

  useEffect(() => {
    if (!focusAfterTransition.current) return;
    focusAfterTransition.current = false;
    if (entered) {
      const main = document.getElementById('main');
      main?.setAttribute('tabindex', '-1');
      main?.focus({preventScroll:true});
    } else entryButton.current?.focus({preventScroll:true});
  }, [entered]);

  function enterSite(immediate = false) {
    if (leaving) return;
    window.dispatchEvent(new Event('wedding:play-music'));
    setInviteOpen(false);
    const finish = () => {
      focusAfterTransition.current = true;
      setLoading(false);
      setEntered(true);
      setLeaving(false);
      window.history.replaceState(null, '', '/' + location.hash);
      window.scrollTo({top:0,behavior:'instant'});
    };
    if (immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    else {
      setLeaving(true);
      transitionTimer.current = setTimeout(finish, 400);
    }
  }

  if (entered) return <><Wedding/><button className="replay-invitation" onClick={() => {
    focusAfterTransition.current = true;
    setEntered(false); setZoom(1);
    window.scrollTo({top:0,behavior:'instant'});
  }}><RotateCcw size={15}/> Open the invitation again</button></>;

  return <main className={'invitation-experience portrait-entry' + (loading ? ' portrait-loading' : ' portrait-ready') + (leaving ? ' portrait-leaving' : '')}>
    {loading && <WeddingLoader onContinue={() => enterSite(true)}/>}
    <div className="portrait-entry-stage" inert={loading || leaving} aria-hidden={loading || leaving}>
      <figure className={'entry-photograph' + (photoFailed ? ' photo-unavailable' : '')}>
        <img src={entrancePhoto} width={1025} height={1534} alt="Blessing Egokiniovo and Blessing Oshevire embracing in front of red drapes" fetchPriority="high" decoding="async" onError={() => setPhotoFailed(true)}/>
      </figure>
      <div className="entry-shade" aria-hidden="true"/>
      <header className="portrait-entry-header"><span>#BlessingFoundHerBlessing</span><span className="entry-header-date">12 December 2026</span></header>
      <div className="portrait-entry-copy">
        <p className="entry-family">Together with the Awhefeada &amp; Toka families</p>
        <h1>Egokiniovo<br/><span>&amp;</span> Oshevire</h1>
        <p className="entry-dedication">From a chance encounter<br/>to a lifetime of love.</p>
        <div className="entry-date"><span>Saturday, 12 December 2026</span><span>11am prompt · Ughelli, Delta State</span></div>
        <div className="portrait-entry-actions">
          <button ref={entryButton} className="entry-primary" onClick={() => enterSite()}>Enter our celebration <ArrowRight size={18}/></button>
          <button ref={invitationButton} className="entry-invitation" onClick={() => {setZoom(1);setInviteOpen(true);}}><Mail size={17}/> Read the invitation</button>
        </div>
      </div>
      <span className="entry-photo-caption" aria-hidden="true">Blessing &amp; Blessing</span>
    </div>

    <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
      <DialogContent className="invitation-closeup" showCloseButton={false} onCloseAutoFocus={event => {event.preventDefault(); invitationButton.current?.focus();}}>
        <div className="invitation-closeup-header"><div><DialogTitle>You’re invited</DialogTitle><DialogDescription>Traditional marriage · 12 December 2026</DialogDescription></div><DialogClose asChild><button className="invitation-back"><ArrowLeft size={17}/> Back</button></DialogClose></div>
        <div className="invitation-zoom-controls" aria-label="Invitation zoom controls"><button disabled={zoom <= 1} onClick={() => setZoom(z => Math.max(1, z - .25))} aria-label="Zoom out"><Minus size={18}/></button><span aria-live="polite">{Math.round(zoom * 100)}%</span><button disabled={zoom >= 2.5} onClick={() => setZoom(z => Math.min(2.5, z + .25))} aria-label="Zoom in"><Plus size={18}/></button><button onClick={() => setZoom(1)} aria-label="Reset zoom"><RotateCcw size={16}/></button></div>
        <div className="invitation-zoom-viewport"><div className="invitation-zoom-paper" style={{width:`${zoom * 100}%`}}><img src="/invitation.jpg" width={850} height={1203} alt="Family invitation: Blessing Egokiniovo Awhefeada Esq. and Engr. Blessing Oshevire Toka, 12 December 2026 at 11am, Ricky’s Hotel and Event Place, Oteri, Ughelli."/></div></div>
        <div className="invitation-closeup-actions"><button onClick={() => enterSite()}>Enter the site <ArrowRight size={17}/></button><Link href="/photographs" onClick={() => setInviteOpen(false)}>View our photographs</Link></div>
      </DialogContent>
    </Dialog>
    <noscript><style>{'.wedding-heart-loader{display:none}.portrait-entry-stage{visibility:visible!important;opacity:1!important}'}</style><div className="entrance-noscript">Open our <a href="/the-day">wedding details</a> or <a href="/photographs">gallery</a>.</div></noscript>
  </main>;
}

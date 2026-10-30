"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import Wedding from './wedding';
import WeddingLoader from './wedding-loader';
import { prepareInvitation } from './invitation-assets';
import WeddingMonogram from './wedding-monogram';
import WeddingScene from './wedding-scene';
import { weddingConfig } from './wedding-config';

const curtainDuration = 1200;

export default function WeddingEntrance() {
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [curtainsReady, setCurtainsReady] = useState(false);
  const sealButton = useRef<HTMLButtonElement>(null);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const focusAfterTransition = useRef(false);
  const siteTarget = useRef<'main' | 'venue'>('main');

  useLayoutEffect(() => {
    // Reloads and returning from another wedding page must start at the entrance,
    // rather than restoring a saved position once the content below it mounts.
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const resetEntranceScroll = () => window.scrollTo({top:0,behavior:'instant'});
    resetEntranceScroll();
    if (!entered) window.addEventListener('pageshow', resetEntranceScroll);
    return () => {
      window.removeEventListener('pageshow', resetEntranceScroll);
      window.history.scrollRestoration = previousRestoration;
    };
  }, [entered]);

  useEffect(() => {
    const url = new URL(location.href);
    if (url.searchParams.has('enter')) {
      url.searchParams.delete('enter');
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    }
    let cancelled = false;
    prepareInvitation().finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; clearTimeout(transitionTimer.current); };
  }, []);

  useLayoutEffect(() => {
    if (!focusAfterTransition.current) return;
    focusAfterTransition.current = false;
    // Reset after React has replaced the full-height entrance, before paint.
    window.scrollTo({top:0,behavior:'instant'});
    if (entered) {
      const main = document.getElementById(siteTarget.current);
      main?.setAttribute('tabindex', '-1');
      main?.focus({preventScroll:true});
      if (siteTarget.current !== 'main') main?.scrollIntoView({behavior:'instant',block:'start'});
    } else sealButton.current?.focus({preventScroll:true});
  }, [entered]);

  useEffect(() => {
    if (!opened) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => {
      setCurtainsReady(true);
    }, reduced ? 0 : curtainDuration);
    return () => clearTimeout(timer);
  }, [opened]);

  useLayoutEffect(() => {
    if (!curtainsReady) return;
    // Mounting the long page below the scene must not move the opening viewport.
    window.scrollTo({top:0,behavior:'instant'});
    document.getElementById('scene-view-invitation')?.focus({preventScroll:true});
  }, [curtainsReady]);

  function openCurtains() {
    setOpened(true);
    window.dispatchEvent(new Event('wedding:play-music'));
  }

  function enterSite(immediate = false, target: 'main' | 'venue' = 'main') {
    if (leaving) return;
    window.dispatchEvent(new Event('wedding:play-music'));
    siteTarget.current = target;
    const finish = () => {
      focusAfterTransition.current = true;
      setLoading(false);
      setEntered(true);
      setLeaving(false);
      window.history.replaceState(window.history.state, '', '/' + location.hash);
    };
    if (immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    else {
      setLeaving(true);
      transitionTimer.current = setTimeout(finish, 400);
    }
  }

  if (entered) return <><Wedding/><button className="replay-invitation" onClick={() => {
    focusAfterTransition.current = true;
    setEntered(false); setOpened(false); setCurtainsReady(false);
  }}><RotateCcw size={15}/> Open the invitation again</button></>;

  return <><div className={'invitation-experience portrait-entry scene-entry' + (loading ? ' portrait-loading' : ' portrait-ready') + (leaving ? ' portrait-leaving' : '') + (opened ? ' curtains-open' : ' curtains-closed') + (curtainsReady ? ' curtains-ready' : '')} style={{'--curtain-duration': `${curtainDuration}ms`} as CSSProperties}>
    {loading && <WeddingLoader onContinue={() => enterSite(true)}/>}
    <WeddingScene active={curtainsReady && !loading && !leaving} onContinue={target => enterSite(true, target)}/>

    {!curtainsReady && <div className="wedding-curtain-layer" inert={loading} aria-hidden={loading}>
      <div className="curtain-panel curtain-left" aria-hidden="true"/>
      <div className="curtain-panel curtain-right" aria-hidden="true"/>
      <div className="curtain-valance" aria-hidden="true"/>
      {!opened && <>
        <div className="sealed-invitation">
          <p className="seal-overline">An invitation from our families</p>
          <button ref={sealButton} className="champagne-seal" onClick={openCurtains} aria-label="Open the wedding invitation"><span className="seal-emboss"><WeddingMonogram/><span>12 · 12 · 26</span></span></button>
          <h1>{weddingConfig.names.together}</h1><p>With love, you’re invited.</p>
          <button className="seal-caption" onClick={openCurtains}>Touch the seal to open <ArrowRight size={15}/></button>
        </div>
        <button className="entrance-skip" onClick={() => enterSite(true)}>Go straight to the site <ArrowRight size={15}/></button>
      </>}
    </div>}

    <noscript><style>{'.wedding-heart-loader,.wedding-curtain-layer{display:none}'}</style><div className="entrance-noscript">Open our <a href="/the-day">wedding details</a> or <a href="/photographs">gallery</a>.</div></noscript>
  </div>{curtainsReady && <Wedding/>}</>;
}

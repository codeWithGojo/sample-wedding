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

  useLayoutEffect(() => {
    // Keep native history restoration from applying an old scroll position after
    // hydration or when this document returns from the browser's page cache.
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const resetEntranceScroll = () => window.scrollTo({top:0,behavior:'instant'});
    resetEntranceScroll();
    window.addEventListener('pageshow', resetEntranceScroll);
    return () => {
      window.removeEventListener('pageshow', resetEntranceScroll);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    const url = new URL(location.href);
    // Old section links must not skip the opening when the long page mounts.
    // Guest-management fragments are kept intact.
    const hasSectionHash = url.hash === '#main' || url.hash === '#venue';
    if (url.searchParams.has('enter') || hasSectionHash) {
      url.searchParams.delete('enter');
      if (hasSectionHash) url.hash = '';
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    }
    let cancelled = false;
    prepareInvitation().finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; clearTimeout(transitionTimer.current); };
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    // Hold the opening viewport while the loader, curtains and page change
    // height. Release it once the scene or the main page is ready to scroll.
    root.setAttribute('data-wedding-opening', '');
    window.scrollTo({top:0,behavior:'instant'});
    const frame = requestAnimationFrame(() => {
      // Next's navigation restoration and the new content layout finish after
      // the first reset. Reset again before enabling normal guest scrolling.
      window.scrollTo({top:0,behavior:'instant'});
      if (curtainsReady || entered) root.removeAttribute('data-wedding-opening');
      if (entered && focusAfterTransition.current) {
        const main = document.getElementById('main');
        main?.setAttribute('tabindex', '-1');
        main?.focus({preventScroll:true});
      } else if (curtainsReady) {
        document.getElementById('scene-view-invitation')?.focus({preventScroll:true});
      } else if (!loading && focusAfterTransition.current) {
        sealButton.current?.focus({preventScroll:true});
      }
      focusAfterTransition.current = false;
    });
    return () => {
      cancelAnimationFrame(frame);
      root.removeAttribute('data-wedding-opening');
    };
  }, [loading, curtainsReady, entered]);

  useEffect(() => {
    if (!opened) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => {
      setCurtainsReady(true);
    }, reduced ? 0 : curtainDuration);
    return () => clearTimeout(timer);
  }, [opened]);

  function openCurtains() {
    setOpened(true);
    window.dispatchEvent(new Event('wedding:play-music'));
  }

  function enterSite(immediate = false) {
    if (leaving) return;
    window.dispatchEvent(new Event('wedding:play-music'));
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

  return <>{!entered && <div className={'invitation-experience portrait-entry scene-entry' + (loading ? ' portrait-loading' : ' portrait-ready') + (leaving ? ' portrait-leaving' : '') + (opened ? ' curtains-open' : ' curtains-closed') + (curtainsReady ? ' curtains-ready' : '')} style={{'--curtain-duration': `${curtainDuration}ms`} as CSSProperties}>
    {loading && <WeddingLoader onContinue={() => enterSite(true)}/>}
    <WeddingScene active={curtainsReady && !loading && !leaving} onContinue={() => enterSite(true)}/>

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
  </div>}{(curtainsReady || entered) && <Wedding key="wedding-content"/>}{entered && <button className="replay-invitation" onClick={() => {
    focusAfterTransition.current = true;
    setEntered(false); setOpened(false); setCurtainsReady(false);
  }}><RotateCcw size={15}/> Open the invitation again</button>}</>;
}

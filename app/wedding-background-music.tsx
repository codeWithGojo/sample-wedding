"use client";

import { useEffect, useRef, useState } from 'react';
import { Music2, VolumeX } from 'lucide-react';
import { spotifySongUrl } from './wedding-song';

export default function WeddingBackgroundMusic({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeFrame = useRef<number | null>(null);
  const manuallyPaused = useRef(false);
  const startRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let cancelled = false;
    let attempt = 0;
    const stopFade = () => {
      if (fadeFrame.current !== null) cancelAnimationFrame(fadeFrame.current);
      fadeFrame.current = null;
    };
    const start = () => {
      if (manuallyPaused.current || !audio.paused) return;
      const currentAttempt = ++attempt;
      stopFade();
      audio.volume = .04;
      // Called directly by the seal's click event when initial autoplay is blocked.
      audio.play().then(() => {
        if (cancelled || currentAttempt !== attempt || manuallyPaused.current) return;
        setPlaying(true);
        const began = performance.now();
        const fade = (now: number) => {
          if (cancelled || audio.paused || manuallyPaused.current) return;
          const progress = Math.min(1, (now - began) / 1800);
          audio.volume = .04 + .28 * progress;
          if (progress < 1) fadeFrame.current = requestAnimationFrame(fade);
          else fadeFrame.current = null;
        };
        fadeFrame.current = requestAnimationFrame(fade);
      }).catch(() => {
        if (!cancelled && currentAttempt === attempt) setPlaying(false);
      });
    };
    const startFromInteraction = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('[data-wedding-music-control]')) return;
      if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') return;
      start();
    };
    startRef.current = start;
    window.addEventListener('wedding:play-music', start);
    window.addEventListener('click', startFromInteraction);
    window.addEventListener('keydown', startFromInteraction);
    start();
    return () => {
      cancelled = true;
      ++attempt;
      stopFade();
      audio.pause();
      startRef.current = () => {};
      window.removeEventListener('wedding:play-music', start);
      window.removeEventListener('click', startFromInteraction);
      window.removeEventListener('keydown', startFromInteraction);
    };
  }, [src]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      manuallyPaused.current = true;
      if (fadeFrame.current !== null) cancelAnimationFrame(fadeFrame.current);
      fadeFrame.current = null;
      audio.pause();
    } else {
      manuallyPaused.current = false;
      startRef.current();
    }
  }

  return <>
    <audio ref={audioRef} src={src} data-wedding-soundtrack preload="auto" loop hidden aria-hidden="true"
      onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onError={() => { setUnavailable(true); setPlaying(false); }}/>
    {unavailable ? <a className="background-music-control" href={spotifySongUrl} target="_blank" rel="noopener noreferrer" aria-label="Listen to Until I Found You on Spotify" title="Listen to our song"><Music2 size={18}/></a> :
      <button className="background-music-control" data-wedding-music-control onClick={toggle}
        aria-label={playing ? 'Pause background music' : 'Play Until I Found You'}
        title={playing ? 'Pause our song' : 'Play our song'} aria-pressed={playing}>
        {playing ? <VolumeX size={18}/> : <Music2 size={18}/>}
      </button>}
  </>;
}

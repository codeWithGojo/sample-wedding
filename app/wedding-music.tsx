"use client";

import WeddingBackgroundMusic from './wedding-background-music';
import { spotifySongUrl } from './wedding-song';

export default function WeddingMusic() {
  // Enable seamless background playback once a direct audio file is supplied.
  const backgroundTrack = process.env.NEXT_PUBLIC_WEDDING_AUDIO_URL;
  if (backgroundTrack) return <WeddingBackgroundMusic src={backgroundTrack}/>;
  return <a className="background-music-control spotify-song-link" href={spotifySongUrl}
    target="_blank" rel="noopener noreferrer"
    aria-label="Listen to Until I Found You by Stephen Sanchez on Spotify, opens in a new tab"
    title="Our song on Spotify">
    <svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="currentColor"/>
      <g fill="none" stroke="#fff8ec" strokeLinecap="round">
        <path d="M6 9c4-1.2 8.5-.8 12 1" strokeWidth="1.9"/>
        <path d="M6.5 12.5c3.5-1 7.2-.7 10.5.8" strokeWidth="1.6"/>
        <path d="M7 16c2.8-.8 5.9-.5 8.5.7" strokeWidth="1.4"/>
      </g>
    </svg>
  </a>;
}

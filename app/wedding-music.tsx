"use client";

import { useEffect, useState } from 'react';
import { Music2, X } from 'lucide-react';

// Use the official player rather than a copied or extracted recording.
export default function WeddingMusic() {
  const [active, setActive] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => {
    const start = () => { setHasOpened(true); setActive(true); };
    window.addEventListener('wedding:play-music', start);
    return () => window.removeEventListener('wedding:play-music', start);
  }, []);
  if (!hasOpened) return null;
  return <aside className={'wedding-music ' + (active ? 'music-is-open' : '')} aria-label="Wedding music">
    {active ? <><div className="wedding-music-heading"><span><Music2 size={14}/> A song for the day</span><button onClick={() => setActive(false)} aria-label="Stop music and close player"><X size={17}/></button></div><iframe title="Stephen Sanchez — Until I Found You, official YouTube video" width="256" height="200" src="https://www.youtube.com/embed/GxldQ9eX2wo?autoplay=1&playsinline=1&controls=1&loop=1&playlist=GxldQ9eX2wo" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/><p>Until I Found You · Stephen Sanchez</p><a href="https://www.youtube.com/watch?v=GxldQ9eX2wo" target="_blank" rel="noopener noreferrer">Play on YouTube if the player doesn’t start</a></> : <button className="wedding-music-toggle" onClick={() => setActive(true)}><Music2 size={16}/> Play our song</button>}
  </aside>;
}

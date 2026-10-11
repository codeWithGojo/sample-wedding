"use client";

import WeddingBackgroundMusic from './wedding-background-music';
import { backgroundSongUrl } from './wedding-song';

export default function WeddingMusic() {
  return <WeddingBackgroundMusic src={process.env.NEXT_PUBLIC_WEDDING_AUDIO_URL || backgroundSongUrl}/>;
}

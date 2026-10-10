import { Camera } from 'lucide-react';

// Enable each feature when the family is ready to use it.
export const photoSharingEnabled = false;

export function PhotoPlaceholder() {
  return <section className="wedding-placeholder photo-placeholder" aria-labelledby="photo-placeholder-title">
    <span className="placeholder-status">Coming soon</span>
    <div className="placeholder-symbol" aria-hidden="true"><Camera size={48} strokeWidth={1.4}/></div>
    <h2 id="photo-placeholder-title">Our wedding album</h2>
    <p>A place for the moments we’ll want to keep. After the celebration, you’ll be able to drop your wedding pictures here and enjoy the album together.</p>
    <button className="button" type="button" disabled>Photo uploads coming soon</button>
    <div className="album-placeholders" aria-hidden="true"><span/><span/><span/></div>
    <span className="placeholder-caption">Wedding photographs will appear here</span>
  </section>;
}

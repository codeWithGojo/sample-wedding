import { weddingConfig } from './wedding-config';

export default function WeddingLoader({ onContinue }: { onContinue?: () => void }) {
  return <div className="wedding-heart-loader">
    <div className="wedding-loader-content" role="status" aria-live="polite">
      <div className="wedding-loader-heart" aria-hidden="true">
        <span className="wedding-loader-pulse"/>
        <svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 55 8.7 32C-5 18.4 14.7-1.3 28.4 12.4L32 16l3.6-3.6C49.3-1.3 69 18.4 55.3 32Z"/></svg>
      </div>
      <p>Preparing your invitation</p>
      <span>{weddingConfig.date.short}</span>
    </div>
    {onContinue && <button className="wedding-loader-continue" onClick={onContinue}>Go straight to the site <span aria-hidden="true">→</span></button>}
  </div>;
}

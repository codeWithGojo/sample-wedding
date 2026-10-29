/** An original, intertwined double-B mark for the couple's shared first name. */
export default function WeddingMonogram({ className = '' }: { className?: string }) {
  return <svg className={'wedding-monogram ' + className} viewBox="0 0 160 160" fill="none" aria-hidden="true" focusable="false">
    <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 116h47c21 0 33-10 33-25 0-14-10-23-27-25 13-4 20-12 20-23 0-14-12-23-32-23H30m14 0v96m7-96v96M51 66h25c13 0 20-8 20-21S88 23 72 23M51 69h27c16 0 25 8 25 22 0 15-9 22-26 22H51" transform="translate(0 16)"/>
      <path d="M30 116h47c21 0 33-10 33-25 0-14-10-23-27-25 13-4 20-12 20-23 0-14-12-23-32-23H30m14 0v96m7-96v96M51 66h25c13 0 20-8 20-21S88 23 72 23M51 69h27c16 0 25 8 25 22 0 15-9 22-26 22H51" transform="translate(28 0)"/>
    </g>
  </svg>;
}

export function WeddingDivider() {
  return <div className="wedding-divider" aria-hidden="true"><span/><WeddingMonogram/><span/></div>;
}

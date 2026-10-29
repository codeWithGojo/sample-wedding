"use client";

import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { venueAddress, venueName } from './content';
import WeddingCalendar from './wedding-calendar';
import WeddingMonogram from './wedding-monogram';
import { Reveal } from './wedding-motion';

export default function VenueInvitation({ directionsUrl, mapUrl, parking, compact = false }: {
  directionsUrl: string; mapUrl?: string; parking?: string; compact?: boolean;
}) {
  return <section className={'venue-invitation section ' + (compact ? 'venue-invitation-compact' : '')} id="venue" aria-labelledby="venue-invitation-heading">
    <Reveal className="venue-invitation-intro">
      <p className="stationery-label">An invitation to Ughelli</p>
      <h2 id="venue-invitation-heading">A place to gather.<br/>A day to remember.</h2>
      <p>Join us as our two families come together to celebrate the beginning of our forever.</p>
    </Reveal>
    <div className="venue-invitation-layout">
      <Reveal className="venue-date-card paper-surface">
        <div className="venue-date-card-inner">
          <WeddingMonogram/>
          <p className="venue-card-occasion">The traditional marriage of<br/><span>Blessing &amp; Blessing</span></p>
          <div className="venue-card-date"><span>Saturday</span><strong>12</strong><span>December 2026</span></div>
          <p className="venue-card-time">11am prompt</p>
          <p className="venue-card-close">Together with the people we love.</p>
        </div>
      </Reveal>
      <Reveal className="venue-arrival" delay={.08}>
        <div className="venue-arrival-heading"><MapPin size={19}/><span>The celebration</span></div>
        <h3>{venueName}</h3>
        <address>{venueAddress}</address>
        <div className="venue-arrival-actions"><a className="button" href={directionsUrl} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={17}/></a><WeddingCalendar className="text-button" label="Save the date"/></div>
        {!compact && <div className="venue-map-frame"><iframe title="Map to Ricky’s Hotel and Event Place" src={mapUrl || 'https://www.google.com/maps?q=' + encodeURIComponent(venueName + ', ' + venueAddress + ', Nigeria') + '&output=embed'} loading="lazy" referrerPolicy="no-referrer" allowFullScreen/></div>}
        {compact ? <Link className="text-link venue-travel-link" href="/travel">Travel &amp; places to stay <ArrowUpRight size={15}/></Link> : <>
          {parking && <div className="venue-arrival-note"><h4>Parking &amp; arrival</h4><p>{parking}</p></div>}
          <a className="text-link venue-help" href="tel:+2347068007835">Need a hand finding us? Call the family.</a>
        </>}
      </Reveal>
    </div>
  </section>;
}

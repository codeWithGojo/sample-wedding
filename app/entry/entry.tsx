"use client";
import {useState,useEffect} from 'react';
import {api} from '../client-api';
import GuestQr from '../qr';
import { EntrancePlaceholder, entranceQrEnabled } from '../wedding-extras';
export default function Entry(){
 const [g,setG]=useState<any>(null),[pass,setPass]=useState(''),[error,setError]=useState('');
 useEffect(()=>{if(!entranceQrEnabled)return;const p=new URLSearchParams(location.search).get('pass')||'';setPass(p);if(!p)return;api('pass?pass='+encodeURIComponent(p)).then(d=>setG(d.guest)).catch(e=>setError(e.message))},[]);
 if(!entranceQrEnabled||!pass)return <main className="entry-page"><a href="/" className="wordmark">B &amp; B</a><p className="eyebrow">12 DECEMBER 2026 · 11AM</p><h1>Your entrance pass.</h1><EntrancePlaceholder/><a className="text-link" href="/guest">Back to the guest area</a><a className="text-link" href="/">Back to the celebration</a></main>;
 return <main className="entry-page"><a href="/" className="wordmark">B &amp; B</a><p className="eyebrow">12 DECEMBER 2026 · 11AM</p><h1>Your entry pass.</h1>{error?<p role="alert">{error}</p>:!g?<p role="status">Loading your pass…</p>:<><h2>{g.name}</h2>{g.status==='approved'&&g.attending==='yes'?<><p>Confirmed for <strong>{g.allowedGuests} {g.allowedGuests===1?'guest':'guests'}</strong>, including you.</p><GuestQr value={location.origin+'/entry?pass='+pass} name={g.name}/><p>{g.checkedIn>0?`${g.checkedIn} of ${g.allowedGuests} guests have checked in.`:'Show this QR to the ushers at the entrance.'}</p><p className="secondary">Ricky’s Hotel and Event Place<br/>Oteri, Ughelli, Delta State</p><button className="button" onClick={()=>window.print()}>Print your pass</button></>:<p>This pass is not active. Please contact the family before arriving.</p>}</>}<a className="text-link" href="/">Back to the celebration</a><a className="text-link" href="tel:+2347068007835">Contact the family</a></main>;
}

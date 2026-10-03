"use client";

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { defaultContent, weddingDate, venueName, venueAddress, type WeddingContent, type Guest, type Photo } from './content';
import { api, newGuestToken, resizePhoto } from './client-api';
import { splitLoveStory, storyImages } from './love-story';
import { nearbyStays } from './stays';
import GuestQr from './qr';
import { EntrancePlaceholder, PhotoPlaceholder, entranceQrEnabled, photoSharingEnabled } from './wedding-extras';

export type WeddingPage = 'welcome'|'story'|'day'|'rsvp'|'travel'|'faqs'|'gifts'|'photographs'|'guest';
const navigation: {page:WeddingPage;path:string;label:string}[] = [
  {page:'welcome',path:'/',label:'Welcome'},
  {page:'story',path:'/our-story',label:'Our story'},
  {page:'day',path:'/the-day',label:'The day'},
  {page:'travel',path:'/travel',label:'Travel & stay'},
  {page:'faqs',path:'/faqs',label:'FAQs'},
  {page:'gifts',path:'/gifts',label:'Gifts'},
  {page:'rsvp',path:'/rsvp',label:'RSVP'},
  {page:'guest',path:'/guest',label:'Guest area'},
  {page:'photographs',path:'/photographs',label:'Photographs'},
];
const headings: Partial<Record<WeddingPage,{title:string;intro:string}>> = {
  story:{title:'Our Love Story',intro:'From 23rd December to Forever.'},
  day:{title:'The day',intro:'Saturday, 12 December 2026 · 11am prompt'},
  rsvp:{title:'Let us know if you’re coming',intro:'We’re looking forward to having our people together in Ughelli.'},
  travel:{title:'Come to Ughelli',intro:'The venue, directions and places to stay for the weekend.'},
  faqs:{title:'A few things you might want to know',intro:'And if we’ve missed anything, speak to the family.'},
  gifts:{title:'A note from us',intro:''},
  photographs:{title:'Photographs from the day',intro:''},
  guest:{title:'For our guests',intro:'We’re glad you’re joining us. Here’s everything you’ll need for the day.'},
};

function FamilyContact(){
  return <aside className="family-contact"><h2>Speak to the family</h2><a href="tel:+2347068007835">0706 800 7835</a><a href="tel:+2347089045705">0708 904 5705</a><a className="button" href="https://wa.me/2347068007835?text=Hello%2C%20I%20have%20a%20question%20about%20Blessing%20and%20Blessing%E2%80%99s%20wedding." target="_blank" rel="noopener noreferrer">Message on WhatsApp</a></aside>;
}

export default function Wedding({page='welcome'}:{page?:WeddingPage}){
  const [c,setC]=useState<WeddingContent>(defaultContent);
  const [loading,setLoading]=useState(true),[loadError,setLoadError]=useState(''),[locked,setLocked]=useState(false),[password,setPassword]=useState('');
  const [countdown,setCountdown]=useState<number|null>(null),[guest,setGuest]=useState<Guest|null>(null),[manageToken,setManageToken]=useState('');
  const [saving,setSaving]=useState(false),[error,setError]=useState(''),[success,setSuccess]=useState(''),[menuOpen,setMenuOpen]=useState(false);
  const [name,setName]=useState(''),[contact,setContact]=useState(''),[attending,setAttending]=useState('yes'),[count,setCount]=useState(1),[dietary,setDietary]=useState(''),[meal,setMeal]=useState('');
  const [photos,setPhotos]=useState<Photo[]>([]),[photoOpen,setPhotoOpen]=useState<Photo|null>(null),[shareMsg,setShareMsg]=useState('');
  const [song,setSong]=useState(''),[artist,setArtist]=useState(''),[musicMsg,setMusicMsg]=useState(''),[siteOrigin,setSiteOrigin]=useState('');
  const [file,setFile]=useState<File|null>(null),[caption,setCaption]=useState(''),[uploadMsg,setUploadMsg]=useState(''),[uploadBusy,setUploadBusy]=useState(false);
  const submissionToken=useRef(''),formRef=useRef<HTMLFormElement>(null),songAttempt=useRef<{song:string;artist:string;id:string}|null>(null);
  const pageHref=(path:string)=>path+(manageToken?'#'+(path==='/'?'guest':'rsvp')+'='+manageToken:'');
  const directionsUrl=c.directionsUrl||defaultContent.directionsUrl;
  const weddingStarted=countdown===0;

  async function load(){
    setLoading(true);setLoadError('');
    try{
      const [details,pictures]=await Promise.all([api('content'),page==='photographs'&&photoSharingEnabled?api('photos'):Promise.resolve(null)]);
      setC(details.content);setLocked(false);if(pictures)setPhotos(pictures.photos);
    }catch(e){
      if((e as Error).message==='Please enter the invitation password.')setLocked(true);
      else setLoadError('Some details couldn’t load. Please try again.');
    }finally{setLoading(false)}
  }
  function applyGuest(g:Guest){setGuest(g);setName(g.name);setContact(g.contact);setAttending(g.attending);setCount(g.guestCount||1);setDietary(g.dietary);setMeal(g.mealPreference||'')}
  async function refreshGuest(t=manageToken,keepReply=false){if(!t)return;try{const d=await api('my-rsvp',{headers:{'X-Guest-Token':t}});if(keepReply)setGuest(d.guest);else applyGuest(d.guest);setError('')}catch(e){setError((e as Error).message)}}
  useEffect(()=>{
    setSiteOrigin(location.origin);
    const fragment=new URLSearchParams(location.hash.slice(1));
    const raw=fragment.get('rsvp')||fragment.get('guest');
    if(raw&&/^[a-f0-9]{64}$/.test(raw)){
      if(page==='welcome'&&fragment.has('rsvp')){location.replace('/rsvp#rsvp='+raw);return;}
      setManageToken(raw);submissionToken.current=raw;void refreshGuest(raw);
    }else submissionToken.current=newGuestToken();
    void load();
    const tick=()=>setCountdown(Math.max(0,new Date(weddingDate).getTime()-Date.now()));tick();
    const interval=setInterval(tick,60000);return()=>clearInterval(interval);
  },[page]);
  useEffect(()=>{
    if(!manageToken||page!=='rsvp')return;
    const interval=setInterval(()=>{if(!document.hidden)void refreshGuest(manageToken,true)},60000);
    return()=>clearInterval(interval);
  },[manageToken,page]);
  useEffect(()=>{
    const context=(document as any).modelContext;if(!context?.registerTool)return;
    const lifecycle=new AbortController();
    try{Promise.resolve(context.registerTool({name:'start_wedding_rsvp',title:'Open wedding RSVP',description:'Open the RSVP page. This does not submit a reply or issue an entry pass.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute:(input:any)=>{
      if(!input||Object.keys(input).length)throw new Error('No input fields are accepted.');
      if(page==='rsvp')formRef.current?.scrollIntoView({behavior:'smooth'});else location.assign(pageHref('/rsvp'));
      return{opened:true,submitted:false};
    }},{signal:lifecycle.signal})).catch(()=>{})}catch{}
    return()=>lifecycle.abort();
  },[page,manageToken]);
  async function unlock(e:FormEvent){e.preventDefault();setSaving(true);setError('');try{await api('auth/login',{method:'POST',body:JSON.stringify({role:'guest',password})});setPassword('');await load();if(manageToken)await refreshGuest()}catch(e){setError((e as Error).message)}finally{setSaving(false)}}
  async function submit(e:FormEvent){
    e.preventDefault();setSaving(true);setError('');setSuccess('');setMusicMsg('');
    const choice={song:song.trim(),artist:artist.trim()};
    try{
      const d=await api('guests',{method:'POST',body:JSON.stringify({name,contact,attending,guestCount:count,dietary,mealPreference:meal,manageToken:submissionToken.current})});
      submissionToken.current=d.manageToken;setManageToken(d.manageToken);applyGuest(d.guest);history.replaceState(null,'','#rsvp='+d.manageToken);
      setSuccess(d.guest.attending==='no'?'Thank you for letting us know. We’ll miss you on the day.':d.guest.status==='approved'?'Your changes are saved. Your entry pass is still confirmed.':'Thank you, we’ve received your reply. Once the family confirms your party, your entry QR will appear here. Keep your private RSVP link.');
      if(d.guest.attending==='yes'&&choice.song&&choice.artist){try{await saveMusic(d.manageToken,choice)}catch{setMusicMsg('Your RSVP is saved, but your song request didn’t go through. Tap “Send just my song request” to try again.')}}
    }catch(e){setError((e as Error).message)}finally{setSaving(false)}
  }
  async function copyLink(){const link=location.origin+'/rsvp#rsvp='+manageToken;try{await navigator.clipboard.writeText(link);setSuccess('Your private RSVP link is copied. Keep it safe so you can reopen your reply and entry pass.')}catch{setSuccess('Copy this private RSVP link: '+link)}}
  async function shareSite(){try{const data={title:'Blessing & Blessing · 12 December 2026',text:'Join us for Blessing and Blessing’s traditional marriage.',url:location.origin};if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(data.url);setShareMsg('Wedding link copied. You can share it on WhatsApp or Instagram.')}}catch{setShareMsg('Copy the wedding website address to share it.')}}
  async function saveMusic(t:string,choice:{song:string;artist:string}){
    if(!songAttempt.current||songAttempt.current.song!==choice.song||songAttempt.current.artist!==choice.artist)songAttempt.current={...choice,id:crypto.randomUUID()};
    const requestId=songAttempt.current.id;
    await api('music',{method:'POST',headers:{'X-Guest-Token':t},body:JSON.stringify({...choice,requestId})});
    setMusicMsg('Your song is on the list for the DJ. Thank you!');
    setSong(current=>current.trim()===choice.song?'':current);setArtist(current=>current.trim()===choice.artist?'':current);
    if(songAttempt.current?.id===requestId)songAttempt.current=null;
  }
  async function sendMusicOnly(){setSaving(true);setMusicMsg('');try{await saveMusic(manageToken,{song:song.trim(),artist:artist.trim()})}catch(e){setMusicMsg((e as Error).message)}finally{setSaving(false)}}
  async function upload(e:FormEvent){e.preventDefault();setUploadBusy(true);setUploadMsg('');try{if(!file)throw new Error('Choose a photo first.');const form=new FormData();form.set('photo',await resizePhoto(file),'wedding-photo.jpg');form.set('caption',caption);await api('photos',{method:'POST',headers:{'X-Guest-Token':manageToken},body:form});setUploadMsg('Your photo is saved and waiting for the couple’s approval.');setFile(null);setCaption('')}catch(e){setUploadMsg((e as Error).message)}finally{setUploadBusy(false)}}
  const days=countdown===null?null:Math.floor(countdown/86400000),hours=countdown===null?null:Math.floor((countdown%86400000)/3600000);
  const passLink=entranceQrEnabled&&guest?.passToken&&typeof window!=='undefined'?location.origin+'/entry?pass='+guest.passToken:'';
  const heading=headings[page];

  if(locked)return <main className="invitation-gate"><a className="wordmark" href="/">B &amp; B</a><p>12 December 2026 · Ughelli</p><h1>You’re invited</h1><p>Enter the password shared with your invitation.</p><form onSubmit={unlock}><label htmlFor="invitation-password">Invitation password</label><input id="invitation-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="button" disabled={saving}>{saving?'Opening…':'Open the invitation'}</button></form>{error&&<p role="alert" className="form-message">{error}</p>}<a className="text-link" href="tel:+2347068007835">Ask the family for help</a></main>;

  return <div className={'wedding-site page-'+page}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="wedding-header">
      <a className="wordmark" href={pageHref('/')} aria-label="Blessing and Blessing home">B &amp; B</a>
      <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="wedding-nav" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'Close menu':'Menu'}</button>
      <nav id="wedding-nav" aria-label="Wedding navigation" className={menuOpen?'is-open':''}>
        {navigation.map(item=><a key={item.page} href={pageHref(item.path)} aria-current={item.page===page?'page':undefined} className={item.page==='rsvp'?'nav-rsvp':undefined}>{item.label}</a>)}
      </nav>
    </header>
    <main id="main">
      {loadError&&<div className="load-notice" role="alert">{loadError} <button className="plain-button" onClick={()=>void load()}>Retry</button></div>}
      {heading&&<header className="page-introduction"><p><a href={pageHref('/')}>Blessing &amp; Blessing</a> · 12 December 2026</p><h1>{page==='story'?(c.storyTitle||heading.title):heading.title}</h1>{heading.intro&&<p className="page-lead">{heading.intro}</p>}</header>}

      {page==='welcome'&&<>
        <section className="welcome-hero">
          {c.heroPhoto?<img className="welcome-background" src={c.heroPhoto} alt="Blessing and Blessing together" fetchPriority="high"/>:<div className="welcome-monogram" aria-hidden="true">B &amp; B</div>}
          <div className="welcome-shade"/>
          <div className="welcome-hero-copy"><p className="occasion">Our traditional marriage</p><h1>Blessing<br/><em>&amp;</em> Blessing</h1><p className="couple-names">Blessing Egohiniovo Awhefeada Esq.<br/>&amp; Engr. Blessing Oshewire Toka</p><p className="welcome-date">Saturday, 12 December 2026<br/><strong>11am prompt</strong> · Ughelli, Delta State</p><div className="actions"><a className="button" href={pageHref('/rsvp')}>Let us know you’re coming</a><a className="text-link" href={directionsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></div><p className="hashtag">#BlessingFoundHerBlessing26</p></div>
        </section>
        <section className="welcome-letter section"><div><p className="welcome-kicker">Dear family and friends,</p><h2>We’re so glad<br/>you’re here</h2></div><div><p>A chance meeting through Onos brought us together on 23 December 2023. Now, we’re bringing our families and favourite people together to celebrate what comes next.</p><p>Thank you for the love you’ve shown us. We’re looking forward to seeing you in Ughelli on 12 December, sharing the day and making a few more memories together.</p><p className="couple-signature">With love,<br/>Blessing &amp; Blessing</p><div className="actions"><a className="text-link" href={pageHref('/our-story')}>Read our story</a><a className="text-link" href={pageHref('/travel')}>Plan your stay</a></div></div></section>
        <div className="date-strip"><span className="date-strip-date">12.12 <small>2026</small></span><span aria-live="off">{days===null?'12 December 2026 · 11am prompt':weddingStarted?'The day is here':`${days} days · ${hours} hours until we celebrate`}</span><a className="button calendar-button" href="/api/calendar">Add to calendar</a></div>
        <section className="section wedding-extras-links" aria-label="Entrance and wedding photographs"><article><p className="placeholder-status">Coming soon</p><h2>Your entrance QR</h2><p>Your personal pass will have a place of its own.</p><a className="button" href="/entry">View entrance pass</a></article><article><p className="placeholder-status">Coming soon</p><h2>Our wedding pictures</h2><p>A shared album for the memories we’ll make together.</p><a className="button" href={pageHref('/photographs')}>Visit the photo area</a></article></section>
      </>}

      {page==='story'&&c.story&&<section className="section story-section" id="story"><div className="story-chapters">{splitLoveStory(c.story).map((chapter,i)=>{const photo=storyImages[i%storyImages.length];return <article className="story-chapter" key={chapter.title||i}>{chapter.title&&<h2>{chapter.title}</h2>}<figure className="story-photograph"><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async"/></figure><div className="story-chapter-copy">{chapter.paragraphs.map((paragraph,n)=><p key={n} className={i===0&&n===0?'story-date':paragraph==='From 23rd December to Forever.'?'story-closing':undefined}>{paragraph}</p>)}</div></article>})}</div><div className="story-next"><a className="button" href={pageHref('/the-day')}>Join us on 12 December</a></div></section>}

      {page==='day'&&<>
        <section className="section day-details"><div className="day-date"><span>12.12</span><p>Saturday · December 2026</p></div><div><h2>The Awhefeada &amp; Toka families</h2><p>Our children, Blessing Egohiniovo and Blessing Oshewire, are getting married. Please join us in Ughelli as we celebrate them and welcome one another into the family.</p><div className="detail-line"><h3>When</h3><p>Saturday, 12 December 2026<br/><strong>11am prompt</strong></p></div><div className="detail-line"><h3>Where</h3><p>{venueName}<br/>{venueAddress}</p></div><a className="text-link" href={pageHref('/travel')}>Venue &amp; travel information</a><a className="text-link invitation-download" href="/invitation.pdf" download>Save the family invitation</a></div></section>
        <section className="section aso-ebi-section"><h2>Aso ebi</h2><div><p>Our colours are Burgundy, Peach, Champagne Gold and Ivory.</p><div className="colour-swatches" aria-label="Colours of the day"><span className="swatch wine" title="Burgundy"/><span className="swatch peach" title="Peach"/><span className="swatch gold" title="Champagne Gold"/><span className="swatch ivory" title="Ivory"/></div><p>Traditional attire is welcome.</p>{c.asoEbi?<p>{c.asoEbi}</p>:<p>For fabric enquiries, speak to the family on <a href="tel:+2347068007835">0706 800 7835</a> or <a href="tel:+2347089045705">0708 904 5705</a>.</p>}</div></section>
        {c.programme.length>1&&<section className="section programme-section" id="programme"><h2>Programme</h2><ol className="programme-timeline">{c.programme.map((item,i)=><li key={i}><span className="programme-time">{item.time}</span><div><h3>{item.title}</h3>{item.detail&&<p>{item.detail}</p>}</div></li>)}</ol></section>}
        <section className="section day-actions"><a className="button" href={pageHref('/rsvp')}>Reply to the invitation</a><a className="button calendar-button" href="/api/calendar">Add to calendar</a><a className="text-link" href={pageHref('/guest')}>Wedding QR</a></section>
        {c.livestreamUrl&&<section className="section livestream-section"><h2>Join us from wherever you are</h2><a className="button" href={c.livestreamUrl} target="_blank" rel="noopener noreferrer">Open the livestream</a></section>}
      </>}

      {page==='rsvp'&&<section className="section rsvp-page-layout">
        <div className="rsvp-aside"><img src="/couple/laughter.webp" alt="Blessing and Blessing sitting together" width={960} height={1280}/><p>Saturday, 12 December 2026<br/><strong>11am prompt</strong></p><p>{venueName}<br/>{venueAddress}</p></div>
        <div className="rsvp-main">
          {!entranceQrEnabled&&<EntrancePlaceholder/>}
          {guest&&<section className="reply-status" id="my-pass"><h2>{guest.status==='approved'?'We’re looking forward to seeing you':guest.attending==='no'?'Thank you for your reply':'Your reply is with the family'}</h2><p>{guest.name}</p><p>{guest.status==='approved'?`Confirmed for ${guest.allowedGuests} ${guest.allowedGuests===1?'guest':'guests'}, including you.`:guest.status==='revoked'?'Your pass is currently inactive. Please contact the family.':guest.attending==='no'?'We’ll miss you on the day.':'Keep your private link and return here for your confirmation and entry QR.'}</p>{passLink&&<div className="guest-pass"><GuestQr value={passLink} name={guest.name}/><p>Show this QR to the ushers. {guest.checkedIn>0?`${guest.checkedIn} of ${guest.allowedGuests} guests have checked in.`:'Save it on your phone or bring a printed copy.'}</p><a href={passLink} className="text-link">Open full entry pass</a></div>}<button className="text-button" onClick={()=>void refreshGuest(manageToken,true)}>Refresh confirmation</button><button className="text-button" onClick={()=>{formRef.current?.scrollIntoView({behavior:'smooth'});document.getElementById('guest-name')?.focus()}}>Edit my reply</button></section>}
          <form ref={formRef} onSubmit={submit} className="rsvp-form" id="reply-form">
            <h2>{guest?'Your reply':'Will you join us?'}</h2><p>Please include yourself in the guest count. The family will confirm your party before issuing an entry pass.</p>
            <label htmlFor="guest-name">Your full name</label><input id="guest-name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} maxLength={150} required/>
            <label htmlFor="guest-contact">Phone number or email</label><input id="guest-contact" autoComplete="tel" value={contact} onChange={e=>setContact(e.target.value)} maxLength={200} required/>
            <fieldset><legend>Will you be attending?</legend><RadioGroup value={attending} onValueChange={setAttending} className="attendance-group"><label><RadioGroupItem id="attending-yes" value="yes"/>Yes, I’ll be there</label><label><RadioGroupItem id="attending-no" value="no"/>I can’t make it</label></RadioGroup></fieldset>
            {attending==='yes'&&<>
              <label htmlFor="guest-count">Guests, including you</label><input id="guest-count" type="number" min="1" max="20" value={count} onChange={e=>setCount(Number(e.target.value))} required/>
              <label htmlFor="meal">Meal preference, if any</label><input id="meal" maxLength={300} value={meal} onChange={e=>setMeal(e.target.value)}/>
              <label htmlFor="dietary">Allergies or dietary needs, if any</label><textarea id="dietary" maxLength={1000} value={dietary} onChange={e=>setDietary(e.target.value)}/>
              <div className="rsvp-song-choice"><h3>One for the DJ</h3><p>What song would get you on the dance floor? Leave a request if you like.</p>
                <label htmlFor="song">Song title (optional)</label><input id="song" maxLength={200} value={song} onChange={e=>setSong(e.target.value)} required={Boolean(artist.trim())} disabled={saving}/>
                <label htmlFor="artist">Artist</label><input id="artist" maxLength={200} value={artist} onChange={e=>setArtist(e.target.value)} required={Boolean(song.trim())} disabled={saving}/>
                {guest?.attending==='yes'&&<button className="text-button" type="button" disabled={saving||!song.trim()||!artist.trim()} onClick={()=>void sendMusicOnly()}>Send just my song request</button>}
              </div>
            </>}
            <p className="privacy-note">Your contact details are shared only with the wedding organisers. <a href="/privacy">Guest privacy</a></p><button className="button" disabled={saving||loading}>{saving?'Saving your reply…':guest?'Save my changes':'Send my reply'}</button>
          </form>
          {error&&<p className="form-message" role="alert">{error}</p>}{success&&<p className="form-message" role="status">{success}</p>}{manageToken&&<button className="text-button" onClick={()=>void copyLink()}>Copy my private RSVP link</button>}
          {musicMsg&&<p className="form-message" role="status">{musicMsg}</p>}
          {manageToken&&<a className="text-link" href={pageHref('/photographs')}>Open the photo page</a>}
        </div>
      </section>}

      {page==='travel'&&<>
        <section className="section venue-section" id="venue"><div><h2>Where we’ll be</h2><h3>{venueName}</h3><p>{venueAddress}</p><p>Saturday, 12 December 2026<br/><strong>11am prompt</strong></p>{c.parking&&<div className="venue-note"><h3>Parking &amp; arrival</h3><p>{c.parking}</p></div>}<a className="text-link" href="tel:+2347068007835">Call the family if you need a hand finding us</a></div><div className="map-area"><iframe title="Google Maps — Ricky’s Hotel and Event Place" src={c.mapUrl||'https://www.google.com/maps?q='+encodeURIComponent(venueName+', '+venueAddress+', Nigeria')+'&output=embed'} loading="lazy" referrerPolicy="no-referrer" allowFullScreen/></div></section>
        <section className="section stay-section"><h2>Staying in Ughelli</h2><p>If you’re travelling in, here are a few places to check. Book your room directly with the hotel or through its booking page for the dates you need.</p><div className="stay-list">{nearbyStays.map((hotel,i)=><article className="stay-row" key={hotel.name}><div className="stay-name"><span className="stay-number">0{i+1}</span><h3>{hotel.name}</h3><p className="hotel-rating">{hotel.stars>0?<><span aria-hidden="true">{'★'.repeat(hotel.stars)}</span> {hotel.stars}-star hotel</>:'Star category not confirmed'}</p>{hotel.review&&<p className="hotel-review">{hotel.review}</p>}</div><div className="stay-details"><p>{hotel.address}</p><p>{hotel.bookingNote}</p><div className="actions"><a className="button" href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer">{hotel.bookingLabel}</a>{hotel.phone&&<><a className="text-link" href={'tel:'+hotel.phone}>Call reservations</a><a className="text-link" href={'https://wa.me/'+hotel.phone.replace('+','')+'?text='+encodeURIComponent('Hello, I would like to ask about room availability for a wedding in Ughelli on 12 December 2026.')} target="_blank" rel="noopener noreferrer">WhatsApp the hotel</a></>}</div><p className="hotel-source"><a href={hotel.sourceUrl} target="_blank" rel="noopener noreferrer">{hotel.ratingSource}</a> · Details checked 2 October 2026</p></div></article>)}</div><p className="booking-note">Please check the final price, availability and cancellation terms before booking. Hotel star categories and guest review scores are shown separately.</p>
          {c.hotels.length>0&&<div className="family-stays"><h3>More places from the family</h3>{c.hotels.map((hotel,i)=><article className="hotel-line" key={i}><div><h4>{hotel.name}</h4><p>{hotel.detail}</p></div>{hotel.url&&<a className="text-link" href={hotel.url} target="_blank" rel="noopener noreferrer">View hotel</a>}</article>)}</div>}
        </section>
      </>}

      {page==='faqs'&&<section className="section faq-page-layout"><div className="faq-groups">
        <section><h2>Your invitation</h2><details><summary>How do I confirm attendance?</summary><p>Open the <a href={pageHref('/rsvp')}>RSVP page</a> and send us your reply. Keep the private link you receive. Your entry QR will appear there once the family confirms your party.</p></details><details><summary>Can I bring another guest?</summary><p>Please include anyone you’d like to bring in your guest count, including yourself. The family will confirm the number on your pass. If your plans change, give us a call.</p></details><details><summary>Can I change my reply?</summary><p>Of course. Open your private RSVP link and tap “Edit my reply”. If you change the number of guests, the family will need to confirm your party again. Lost the link? Give us a call.</p></details></section>
        <section><h2>On the day</h2><details><summary>When and where is the marriage?</summary><p>Saturday, 12 December 2026, 11am prompt, at {venueName}, {venueAddress}.</p></details><details><summary>What should I bring to the entrance?</summary><p>Save your entry QR on your phone, or bring a printed copy. If you can’t find it when you arrive, speak to an usher. They can look up your name.</p></details><details><summary>What should I wear?</summary><p>Traditional attire is welcome. Our colours are Burgundy, Peach, Champagne Gold and Ivory. For aso ebi fabric enquiries, speak to the family using the numbers here.</p></details></section>
        <section><h2>Travel &amp; stay</h2><details><summary>Where can I find a hotel?</summary><p>Our <a href={pageHref('/travel')}>Travel &amp; Stay page</a> has hotel locations, published star categories and booking links. Choose your travel dates on the booking page or contact the hotel directly.</p></details><details><summary>Can someone help me with directions?</summary><p>Use Directions below to open Google Maps. If you get stuck on your way to Oteri, call the family on 0706 800 7835 or 0708 904 5705.</p></details></section>
        {(c.registryUrl||c.accountNumber)&&<section><h2>Gifts</h2><details><summary>Where are the gift details?</summary><p>The couple’s confirmed gift details are on the <a href={pageHref('/gifts')}>Gifts page</a>. If you have a question, speak to the family.</p></details></section>}
      </div><FamilyContact/></section>}

      {page==='gifts'&&<section className="section gifts-page-layout"><div className="couple-note"><p>Thank you for making time for us and for the love you’ve shown our families. We’re looking forward to sharing the day with you.</p><p className="couple-signature">Blessing &amp; Blessing</p>{(c.bankName||c.registryUrl)&&c.giftNote&&<p>{c.giftNote}</p>}{c.bankName&&c.accountNumber&&<div className="bank-details"><h2>Cash gifts</h2><p><span>Bank</span>{c.bankName}</p><p><span>Account name</span>{c.accountName}</p><p><span>Account number</span><strong>{c.accountNumber}</strong></p><button className="text-button" onClick={async()=>{try{await navigator.clipboard.writeText(c.accountNumber);setShareMsg('Account number copied.')}catch{setShareMsg('Account number: '+c.accountNumber)}}}>Copy account number</button></div>}{c.registryUrl&&<div className="registry-link"><h2>Our gift list</h2><a href={c.registryUrl} className="button" target="_blank" rel="noopener noreferrer">Open the gift list</a></div>}</div><img className="gifts-photo" src="/couple/forever.webp" alt="Blessing kissing Blessing on the cheek" width={960} height={1378}/></section>}

      {page==='guest'&&<section className="section guest-hub-layout">
        <div className="guest-hub-actions">
          <section><h2>Find the venue</h2><p>{venueName}<br/>{venueAddress}</p><p>Saturday, 12 December 2026<br/><strong>11am prompt</strong></p><a className="button" href={directionsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></section>
          <section><h2>Let us know you’re coming</h2><p>Send your reply, tell us who’s coming with you and leave a song for the DJ.</p><a className="button" href={pageHref('/rsvp')}>{guest?'Open my reply & entry pass':'RSVP & request a song'}</a></section>
          <section><h2>Your entrance QR</h2><p>Your personal entrance pass will be available here later.</p><a className="button" href="/entry">View entrance pass</a></section>
          <section><h2>Keep the memories</h2><p>Our wedding photo area is ready for the memories to come. Photo uploads are coming soon.</p><a className="button" href={pageHref('/photographs')}>Open the photo area</a></section>
        </div>
        <aside className="wedding-qr"><p className="qr-couple-names">Blessing &amp; Blessing</p><h2>Scan for the day</h2><p>Directions, RSVP, song requests and photographs, all here.</p>{siteOrigin?<><GuestQr value={siteOrigin+'/guest'} name="Blessing and Blessing" label="Wedding QR for venue directions, RSVP and photographs" downloadName="blessing-wedding-qr.png"/><a className="text-link" href={siteOrigin+'/guest'}>Open the wedding link</a></>:<p role="status">Preparing the wedding QR…</p>}<p className="qr-note">You can share this QR with our guests. Your personal entry QR will be on your private RSVP page.</p></aside>
      </section>}

      {page==='photographs'&&<section className="section gallery-section">
        {!photoSharingEnabled?<PhotoPlaceholder/>:<>
        {photos.length>0&&<div className="gallery-grid">{photos.map(p=><button key={p.id} className="photo-tile" onClick={()=>setPhotoOpen(p)} aria-label={p.caption||'Open wedding photo'}><img src={'/api/photos/'+p.id} alt={p.caption||'Blessing and Blessing’s celebration'} loading="lazy"/>{p.caption&&<span>{p.caption}</span>}</button>)}</div>}
        <div className="photo-page-note"><h2>Share a moment</h2><p>The dance floor, a family reunion, that photograph we didn’t know you took. We’d love to keep your favourite moments from our day.</p>
          {!(weddingStarted||c.uploadOpen)&&<p>Guest uploads open on 12 December 2026 at 11am. Keep your private RSVP link to return here and add your photos.</p>}
          {(weddingStarted||c.uploadOpen)&&guest?.status!=='approved'&&<><p>Open your saved private RSVP link, then tap “Open the photo page” to add your photos. If you’re waiting for your confirmation, speak to the family.</p><a className="button" href={pageHref('/rsvp')}>{guest?'Open my RSVP':'Reply to the invitation'}</a></>}
          <p>Photos are saved for the couple and appear here after they approve them. Please share only pictures you have permission to upload.</p>
        </div>
        {(weddingStarted||c.uploadOpen)&&guest?.status==='approved'&&<form className="guest-upload" onSubmit={upload}><label htmlFor="guest-photo">Your photo</label><input id="guest-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setFile(e.target.files?.[0]||null)} required/><label htmlFor="guest-caption">Caption (optional)</label><input id="guest-caption" maxLength={300} value={caption} onChange={e=>setCaption(e.target.value)}/><button className="button" disabled={uploadBusy}>{uploadBusy?'Uploading…':'Send photo to the couple'}</button>{uploadMsg&&<p className="form-message" role="status">{uploadMsg}</p>}</form>}
        </>}
        <a className="text-link" href={pageHref('/guest')}>Back to the wedding QR page</a>
      </section>}
    </main>
    <footer className="wedding-footer"><a className="wordmark" href={pageHref('/')}>B &amp; B</a><p>#BlessingFoundHerBlessing26</p><div><button className="text-button" onClick={()=>void shareSite()}>Share the celebration</button><a href={siteOrigin?'https://wa.me/?text='+encodeURIComponent('Blessing & Blessing · 12 December 2026 · '+siteOrigin):'https://wa.me/'} target="_blank" rel="noopener noreferrer">Share on WhatsApp</a><a href={pageHref('/guest')}>Wedding QR</a><a href="/privacy">Guest privacy</a><a href="/organiser">Organiser</a></div>{shareMsg&&<p role="status">{shareMsg}</p>}</footer>
    <div className="mobile-actions"><a href={pageHref('/rsvp')}>{guest?'Your RSVP':'RSVP'}</a><a href={directionsUrl} target="_blank" rel="noopener noreferrer">Directions</a><a href="/entry">Entry pass</a></div>
    <Dialog open={!!photoOpen} onOpenChange={open=>{if(!open)setPhotoOpen(null)}}><DialogContent className="photo-dialog" showCloseButton={false}><DialogClose asChild><button className="dialog-close">Close</button></DialogClose><DialogTitle className="sr-only">Wedding photograph</DialogTitle><DialogDescription>{photoOpen?.caption||'A moment to keep'}</DialogDescription>{photoOpen&&<img src={'/api/photos/'+photoOpen.id} alt={photoOpen.caption||'Wedding photograph'}/>}</DialogContent></Dialog>
  </div>;
}

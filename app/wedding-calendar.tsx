"use client";

import { weddingConfig } from './wedding-config';

import { useId, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, Bell, CalendarDays, Clock3, MapPin, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { googleCalendarUrl, reminderChoices, weddingSiteUrl, type CalendarReminder } from './calendar';
import { storyImages } from './love-story';

export default function WeddingCalendar({className='button calendar-button',label='Save the date'}:{className?:string;label?:string}) {
  const [reminder,setReminder]=useState<CalendarReminder>('both');
  const [action,setAction]=useState<'google'|'file'|null>(null);
  const reminderId=useId();
  const path='/api/calendar?reminder='+reminder;
  return <Dialog onOpenChange={open=>{if(open)setAction(null);}}>
    <DialogTrigger asChild><button className={className}><CalendarDays size={18} aria-hidden="true"/><span>{label}</span></button></DialogTrigger>
    <DialogContent className="calendar-dialog" showCloseButton={false}>
      <DialogClose asChild><button className="calendar-close" aria-label="Close calendar options"><X size={20}/></button></DialogClose>
      <div className="calendar-cover"><img src={storyImages[2].src} width={1025} height={1534} alt={weddingConfig.gallery[3].alt}/><div><span>A date for your diary</span><strong>12<span>December 2026</span></strong></div></div>
      <div className="calendar-dialog-body"><DialogTitle>We’ll see you there.</DialogTitle><DialogDescription>Save our traditional marriage to your calendar.</DialogDescription>
        <div className="calendar-event-details"><p><Clock3 size={16}/>Saturday, 12 December · 11am WAT</p><p><MapPin size={16}/><span>Ricky’s Hotel and Event Place<br/><small>Oteri, Ughelli, Delta State</small></span></p></div>
        <div className="calendar-reminder"><label htmlFor={reminderId}><Bell size={16}/>Remind me</label><select id={reminderId} value={reminder} onChange={event=>setReminder(event.target.value as CalendarReminder)}>{reminderChoices.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
        <div className="calendar-providers">
          <a className="calendar-provider" href={path} type="text/calendar" onClick={()=>setAction('file')}><span className="calendar-provider-icon"><CalendarDays size={22}/></span><span><strong>Apple Calendar / iPhone</strong><small>Also works with Outlook and .ics apps</small></span><ArrowDownToLine size={18}/></a>
          <a className="calendar-provider" href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" onClick={()=>setAction('google')}><span className="calendar-provider-icon"><CalendarDays size={22}/></span><span><strong>Google Calendar / Android</strong><small>Open the event, then choose Save</small></span><ArrowUpRight size={18}/></a>
        </div>
        <p className="calendar-feedback" role="status">{action==='google'?'Google Calendar opens with the event details. Set your notifications there before saving.':action==='file'?'Open the calendar file and confirm Add or Save. Your selected reminders are included.':'Calendar files include your selected reminders. In Google Calendar, choose notifications before saving.'}</p>
        <div className="calendar-fallback"><a href={'webcal://'+new URL(weddingSiteUrl).host+path}>Subscribe in Apple Calendar</a><a href={path+'&download=1'} download>Download .ics</a></div>
        <p className="calendar-smallprint">Calendar time: 11am–12pm WAT. The one-hour slot is a placeholder; the celebration’s finish is to be confirmed. If WhatsApp won’t open your calendar, open this page in Safari or Chrome.</p>
      </div>
    </DialogContent>
  </Dialog>;
}

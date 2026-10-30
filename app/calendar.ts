import { weddingConfig } from './wedding-config';
import { venueAddress, venueName } from './content';

export const weddingSiteUrl = weddingConfig.siteUrl;
export const calendarStart = weddingConfig.date.calendarStart; // 11am in Africa/Lagos.
export const calendarEnd = weddingConfig.date.calendarEnd; // A one-hour calendar placeholder, not the celebration's finish.
export const calendarTitle = '#BlessingFoundHerBlessing — Traditional marriage';
export const calendarLocation = `${venueName}, ${venueAddress}, Nigeria`;
export const calendarDescription = `Join the Awhefeada and Toka families to celebrate ${weddingConfig.names.brideFormal} and ${weddingConfig.names.groomFormal}.\nSaturday, 12 December 2026. 11am prompt, West Africa Time.\nThe calendar reserves one hour; the celebration's finishing time is not confirmed.\nWedding details: ${weddingSiteUrl}/the-day`;
export const reminderChoices = [
  {value:'both',label:'1 day and 1 hour before'},
  {value:'day',label:'1 day before'},
  {value:'hour',label:'1 hour before'},
  {value:'none',label:'No reminder'},
] as const;
export type CalendarReminder = typeof reminderChoices[number]['value'];
export function validReminder(value:string|null):CalendarReminder {
  return reminderChoices.some(option=>option.value===value) ? value as CalendarReminder : 'both';
}
export function googleCalendarUrl() {
  const query = new URLSearchParams({action:'TEMPLATE',text:calendarTitle,dates:`${calendarStart}/${calendarEnd}`,
    stz:'Africa/Lagos',etz:'Africa/Lagos',ctz:'Africa/Lagos',details:calendarDescription,location:calendarLocation});
  return 'https://calendar.google.com/calendar/render?' + query;
}

function escapeCalendar(value:string) {
  return value.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
}
function foldCalendarLine(line:string) {
  const encoder = new TextEncoder();
  const lines:string[]=[];
  let current='',octets=0;
  for(const character of line) {
    const size=encoder.encode(character).length;
    if(octets+size>75) {lines.push(current);current=' ';octets=1;}
    current+=character;octets+=size;
  }
  lines.push(current);
  return lines.join('\r\n');
}
export function buildWeddingCalendar(reminder:CalendarReminder='both',now=new Date()) {
  const stamp=now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//BlessingFoundHerBlessing//Wedding//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',
    'X-WR-CALNAME:'+escapeCalendar(weddingConfig.names.together),'X-WR-TIMEZONE:Africa/Lagos','BEGIN:VEVENT',
    'UID:blessing-found-her-blessing-20261212@sample-wedding-mu.vercel.app','SEQUENCE:2',
    'DTSTAMP:'+stamp,'DTSTART:'+calendarStart,'DTEND:'+calendarEnd,'STATUS:CONFIRMED','TRANSP:OPAQUE',
    'SUMMARY:'+escapeCalendar(calendarTitle),'LOCATION:'+escapeCalendar(calendarLocation),
    'DESCRIPTION:'+escapeCalendar(calendarDescription),'URL:'+weddingSiteUrl+'/the-day'];
  const triggers=reminder==='both'?['-P1D','-PT1H']:reminder==='day'?['-P1D']:reminder==='hour'?['-PT1H']:[];
  for(const trigger of triggers)lines.push('BEGIN:VALARM','ACTION:DISPLAY','TRIGGER:'+trigger,
    'DESCRIPTION:'+escapeCalendar('#BlessingFoundHerBlessing starts at 11am in Ughelli.'),'END:VALARM');
  lines.push('END:VEVENT','END:VCALENDAR');
  return lines.map(foldCalendarLine).join('\r\n')+'\r\n';
}

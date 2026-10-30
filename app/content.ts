import { suppliedLoveStory } from './love-story';
import { weddingConfig } from './wedding-config';

export type ProgrammeItem = { time: string; title: string; detail: string };
export type Hotel = { name: string; detail: string; url: string };
export type WeddingContent = {
  story: string; storyTitle: string; heroPhoto: string; storyRevision: number;
  programme: ProgrammeItem[]; parking: string; hotels: Hotel[];
  giftNote: string; bankName: string; accountName: string; accountNumber: string;
  registryUrl: string; livestreamUrl: string; asoEbi: string;
  uploadOpen: boolean; mapUrl: string; directionsUrl: string;
};
export const venueAddress = weddingConfig.venue.address;
export const venueName = weddingConfig.venue.name;
export const weddingDate = weddingConfig.date.iso;
// Upgrade older backend copy while preserving guest settings and future family edits.
export function currentWeddingContent(content: WeddingContent): WeddingContent {
  if (Number(content.storyRevision || 0) >= defaultContent.storyRevision) return content;
  return {...content, story:defaultContent.story, storyTitle:defaultContent.storyTitle,
    heroPhoto:defaultContent.heroPhoto, storyRevision:defaultContent.storyRevision};
}
export const defaultContent: WeddingContent = {
 story: suppliedLoveStory, storyTitle: "Our Love Story ❤️", heroPhoto: "/couple/forever.webp?v=real-20261029", storyRevision: 2,
 programme: [],
 parking:"",hotels:[],giftNote:"",bankName:"",accountName:"",accountNumber:"",registryUrl:"",livestreamUrl:"",asoEbi:"",uploadOpen:false,mapUrl:"",
 directionsUrl:"https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(venueName+", "+venueAddress+", Nigeria")
};
export type Guest = { id:string; name:string; contact:string; attending:string; guestCount:number; allowedGuests:number; dietary:string; mealPreference:string; status:string; checkedIn:number; createdAt:string; passToken?:string };
export type Photo = { id:string; caption:string; uploadedBy:string; status:string; createdAt:string };

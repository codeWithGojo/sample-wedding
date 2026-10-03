import { suppliedLoveStory } from './love-story';

export type ProgrammeItem = { time: string; title: string; detail: string };
export type Hotel = { name: string; detail: string; url: string };
export type WeddingContent = {
  story: string; storyTitle: string; heroPhoto: string; storyRevision: number;
  programme: ProgrammeItem[]; parking: string; hotels: Hotel[];
  giftNote: string; bankName: string; accountName: string; accountNumber: string;
  registryUrl: string; livestreamUrl: string; asoEbi: string;
  uploadOpen: boolean; mapUrl: string; directionsUrl: string;
};
export const venueAddress = "No. 9 Okpare/Oteri Road, Oteri, Ughelli, Delta State";
export const venueName = "Ricky’s Hotel and Event Place";
export const weddingDate = "2026-12-12T11:00:00+01:00";
export const defaultContent: WeddingContent = {
 story: suppliedLoveStory, storyTitle: "Our Love Story ❤️", heroPhoto: "/couple/forever.webp", storyRevision: 1,
 programme: [],
 parking:"",hotels:[],giftNote:"",bankName:"",accountName:"",accountNumber:"",registryUrl:"",livestreamUrl:"",asoEbi:"",uploadOpen:false,mapUrl:"",
 directionsUrl:"https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(venueName+", "+venueAddress+", Nigeria")
};
export type Guest = { id:string; name:string; contact:string; attending:string; guestCount:number; allowedGuests:number; dietary:string; mealPreference:string; status:string; checkedIn:number; createdAt:string; passToken?:string };
export type Photo = { id:string; caption:string; uploadedBy:string; status:string; createdAt:string };

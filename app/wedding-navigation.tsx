"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, CalendarDays, MapPin, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import WeddingCalendar from './wedding-calendar';
import type { WeddingPage } from './wedding';

const links = [
  {page:'welcome',path:'/',label:'Welcome',detail:'An invitation from our families'},
  {page:'story',path:'/our-story',label:'Our story',detail:'From an ordinary day at the bank'},
  {page:'day',path:'/the-day',label:'The day',detail:'12 December, 11am prompt'},
  {page:'travel',path:'/travel',label:'Travel & stay',detail:'Find your way to Ughelli'},
  {page:'photographs',path:'/photographs',label:'Photographs',detail:'A few moments, just us'},
  {page:'faqs',path:'/faqs',label:'A few questions',detail:'The little details to help you plan'},
  {page:'guest',path:'/guest',label:'For our guests',detail:'Directions and the wedding QR'},
] as const;

export default function WeddingNavigation({page,guestToken=''}:{page:WeddingPage;guestToken?:string}) {
  const [open,setOpen]=useState(false);
  const reduce=useReducedMotion();
  const href=(path:string)=>path+(guestToken?'#guest='+guestToken:'');
  return <header className="wedding-header wedding-header-v2">
    <Link className="wedding-brand" href={href('/')} aria-label="#BlessingFoundHerBlessing home"><img src="/favicon-192.png?v=portrait-2026" width={40} height={40} alt=""/><span><strong>Blessing &amp; Blessing</strong><small>#BlessingFoundHerBlessing</small></span></Link>
    <nav className="desktop-wedding-nav" aria-label="Wedding navigation">{links.filter(link=>['welcome','story','day','photographs'].includes(link.page)).map(link=><Link key={link.page} href={href(link.path)} aria-current={page===link.page?'page':undefined}>{page===link.page&&<motion.span className="nav-active-pill" layoutId="active-wedding-page" transition={reduce?{duration:0}:{type:'spring',stiffness:500,damping:40}}/>}<span>{link.page==='photographs'?'Gallery':link.label}</span></Link>)}</nav>
    <div className="wedding-header-actions"><WeddingCalendar className="header-calendar" label="12.12.26"/>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><button className="wedding-menu-button"><span>Menu</span><span className="menu-glyph" aria-hidden="true"><i/><i/></span></button></DialogTrigger>
        <DialogContent className="wedding-menu-sheet" showCloseButton={false}>
          <div className="menu-sheet-top"><span>Blessing &amp; Blessing</span><DialogClose asChild><button className="menu-close" aria-label="Close menu"><X size={22}/></button></DialogClose></div>
          <DialogTitle className="sr-only">Wedding menu</DialogTitle><DialogDescription className="sr-only">Explore our story, the celebration, photographs and travel information.</DialogDescription>
          <nav className="wedding-menu-links" aria-label="All wedding pages">{links.map((link,index)=><motion.div key={link.path} initial={false} animate={reduce?{opacity:1}:{opacity:[0,1],x:[16,0]}} transition={{duration:reduce?0:.4,delay:reduce?0:index*.035,ease:[.22,1,.36,1]}}><Link href={href(link.path)} aria-current={page===link.page?'page':undefined} onClick={()=>setOpen(false)}><span><strong>{link.label}</strong><small>{link.detail}</small></span><ArrowUpRight size={20}/></Link></motion.div>)}</nav>
          <div className="menu-sheet-event"><img src="/couple/red-portrait.webp?v=real-20261029" width={72} height={92} alt="Blessing and Blessing in front of red drapes"/><div><p><CalendarDays size={14}/>12 December 2026</p><p><MapPin size={14}/>Ughelli, Delta State</p><Link href={href('/the-day')} onClick={()=>setOpen(false)}>Details for the day <ArrowUpRight size={13}/></Link></div></div>
        </DialogContent>
      </Dialog>
    </div>
  </header>;
}

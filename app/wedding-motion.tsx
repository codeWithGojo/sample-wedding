"use client";

import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

const ease = [.22,1,.36,1] as const;

export function WeddingProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress }=useScroll();
  const scaleX=useSpring(scrollYProgress,{stiffness:160,damping:32,restDelta:.001});
  return <motion.div className="wedding-scroll-progress" style={{scaleX:reduce?scrollYProgress:scaleX}} aria-hidden="true"/>;
}
export function WeddingPageMotion({children,page}:{children:ReactNode;page:string}) {
  const reduce=useReducedMotion();
  return <motion.div className="wedding-page-motion" key={page} initial={false} animate={reduce?{opacity:1}:{opacity:[.5,1],y:[8,0]}} transition={{duration:reduce?0:.4,ease}}>{children}</motion.div>;
}
export function Reveal({children,className='',delay=0}:{children:ReactNode;className?:string;delay?:number}) {
  const reduce=useReducedMotion();
  return <motion.div className={'wedding-reveal '+className} initial={false} whileInView={reduce?{opacity:1}:{opacity:[.4,1],y:[18,0]}} viewport={{once:true,amount:.12}} transition={{duration:reduce?0:.65,delay:reduce?0:delay,ease}}>{children}</motion.div>;
}
export function ScrollPhoto({src,alt,width=1025,height=1534,className='',priority=false}:{src:string;alt:string;width?:number;height?:number;className?:string;priority?:boolean}) {
  const ref=useRef<HTMLElement>(null);
  const reduce=useReducedMotion();
  const { scrollYProgress }=useScroll({target:ref,offset:['start end','end start']});
  const y=useTransform(scrollYProgress,[0,1],['-3%','3%']);
  return <motion.figure ref={ref} className={'scroll-photograph '+className} initial={false} whileInView={reduce?{}:{clipPath:['inset(5% 0 0 0)','inset(0% 0 0 0)']}} viewport={{once:true,amount:.08}} transition={{duration:.85,ease}}><motion.img src={src} alt={alt} width={width} height={height} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} decoding="async" style={{y:reduce?0:y,scale:reduce?1:1.06}}/></motion.figure>;
}

"use client";
import { useEffect,useState } from 'react';
export default function GuestQr({value,name,label,downloadName='blessing-wedding-entry-qr.png'}:{value:string;name:string;label?:string;downloadName?:string}){
 const [src,setSrc]=useState(''),[error,setError]=useState('');
 useEffect(()=>{let alive=true;setSrc('');setError('');import('qrcode').then(q=>q.toDataURL(value,{width:800,margin:4,errorCorrectionLevel:'M',color:{dark:'#4b1424',light:'#ffffff'}})).then(u=>{if(alive)setSrc(u)}).catch(()=>{if(alive)setError('Couldn’t display this QR. Please refresh, or use the link below.')});return()=>{alive=false}},[value]);
 return <div className="qr-panel">{src?<><img src={src} alt={label||`Entry QR code for ${name}`} width="240" height="240"/><a className="text-link" href={src} download={downloadName}>Save QR image</a></>:<p role={error?'alert':'status'}>{error||'Preparing your QR…'}</p>}</div>;
}

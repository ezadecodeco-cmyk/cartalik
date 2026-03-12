"use client";

import Image from "next/image";

import {
  Phone,
  Mail,
  MessageCircle,
  Globe,
  MapPin,
  Star,
  Download,
  ExternalLink,
  Smartphone,
  CheckCircle,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import LeadCaptureForm from "./LeadCaptureForm";

interface UserProfile {
  id: string;
  name: string;
  username: string;
  photo_url: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  title?: string;
  company?: string;
  bio?: string;
  is_active: boolean;
  card_type: string;
  bg_color?: string;
  font_color?: string;
  cv_url?: string;
  catalogue_url?: string;
  location_url?: string;
  google_reviews_url?: string;
}

interface PublicCardClientProps {
  profile: UserProfile;
  links: any[];
  products?: any[];
  leads?: any[];
}

export default function PublicCardClient({ profile, links, products = [] }: PublicCardClientProps) {
  const { t } = useLocale();
  const isBusiness = profile.card_type === "business";
  const initials = profile.name ? profile.name.substring(0, 2).toUpperCase() : "US";
  const fontColor = profile.font_color || '#ffffff';
  const bgColor = profile.bg_color || '#000000';

  const vcardData = `BEGIN:VCARD
VERSION:3.0
N:;${profile.name};;;
FN:${profile.name}
ORG:${profile.company || ''}
TITLE:${profile.title || ''}
TEL;type=CELL:${profile.phone || ''}
EMAIL:${profile.email || ''}
NOTE:${profile.bio || ''}
END:VCARD`;

  const vcardUrl = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardData)}`;

  if (!profile.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <Smartphone className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t('publicCard.inactive')}</h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed font-medium">
            {t('publicCard.inactiveDesc')}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-2xl shadow-emerald-500/20 hover:scale-[1.05] transition-transform"
          >
            {t('publicCard.renewBtn')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-start justify-center py-20 px-5 pt-28 lg:pt-40 relative overflow-hidden font-sans selection:bg-emerald-500/30"
      style={{ backgroundColor: bgColor }}
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dynamic Orbs */}
        <div 
          className="absolute top-[-10%] right-[-5%] w-[70%] h-[70%] rounded-full blur-[120px] opacity-20 animate-pulse duration-[10s]" 
          style={{ backgroundColor: fontColor }}
        />
        <div 
          className="absolute bottom-[-15%] left-[-10%] w-[80%] h-[80%] rounded-full blur-[150px] opacity-10" 
          style={{ backgroundColor: fontColor }}
        />
        
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        
        {/* Global Mesh Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      </div>

      <div className="w-full max-w-[440px] relative z-10 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        
        {/* SECTION 1: IDENTITY CARD */}
        <div className="group relative">
          {/* Card Border Glow */}
          <div className="absolute -inset-[1px] rounded-[3rem] bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative rounded-[3rem] border border-white/10 bg-white/[0.03] backdrop-blur-3xl overflow-hidden px-8 pt-12 pb-10">
            {/* Avatar Signature */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-full blur-3xl scale-125 opacity-20 animate-pulse"
                  style={{ backgroundColor: fontColor }}
                />
                <div className="relative p-1.5 rounded-full bg-gradient-to-tr from-white/20 via-white/5 to-transparent shadow-2xl">
                    {profile.photo_url ? (
                      <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-white/10 shadow-inner">
                        <Image 
                          src={profile.photo_url} 
                          alt={profile.name || "Profile"} 
                          fill 
                          className="object-cover scale-105 hover:scale-100 transition-transform duration-[2s] ease-out" 
                        />
                      </div>
                    ) : (
                      <div 
                        className="w-36 h-36 rounded-full bg-white/5 flex items-center justify-center text-4xl font-light tracking-tighter border-2 border-white/10" 
                        style={{ color: fontColor }}
                      >
                        {initials}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="text-center space-y-2.5">
              <div className="flex items-center justify-center gap-2.5">
                <h1 className="text-3xl font-bold tracking-tight leading-tight" style={{ color: fontColor }}>
                  {profile.name}
                </h1>
                {isBusiness && <CheckCircle className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" />}
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60 flex items-center justify-center gap-3">
                <span className="w-2 h-[1px] bg-current" />
                {profile.title}
                <span className="w-2 h-[1px] bg-current" />
              </p>
              {profile.company && (
                <p className="text-xs font-medium tracking-wide opacity-40 italic pt-1" style={{ color: fontColor }}>
                  {profile.company}
                </p>
              )}
            </div>

            {/* Bio Section */}
            {profile.bio && (
              <div className="mt-8 px-4 border-t border-white/5 pt-8">
                  <p className="text-center font-normal leading-relaxed text-[13px] tracking-wide text-balance opacity-70" style={{ color: fontColor }}>
                    {profile.bio}
                  </p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: COMMAND HUB (GRID ACTIONS) */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: MessageCircle, label: 'WhatsApp', href: profile.whatsapp ? `https://wa.me/${profile.whatsapp}` : null, color: '#25D366' },
            { icon: Phone, label: t('userDashboard.phone'), href: profile.phone ? `tel:${profile.phone}` : null, color: fontColor },
            { icon: Mail, label: t('userDashboard.email'), href: profile.email ? `mailto:${profile.email}` : null, color: fontColor },
          ].filter(a => a.href).map((action) => (
            <a
              key={action.label}
              href={action.href!}
              className="flex flex-col items-center justify-center aspect-square rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 group relative overflow-hidden"
              style={{ color: fontColor }}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ backgroundColor: action.color }}
              />
              <action.icon className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform duration-500" />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                {action.label}
              </span>
            </a>
          ))}
        </div>

        {/* SECTION 3: BUSINESS ASSETS */}
        {(profile.cv_url || profile.location_url || profile.google_reviews_url) && (
          <div className="grid grid-cols-1 gap-4">
             {profile.cv_url && (
               <a
                 href={profile.cv_url}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center gap-6 px-7 py-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-500 group"
               >
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Download className="w-6 h-6" />
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-bold text-white tracking-tight">{t('publicCard.downloadCV') || "Curriculum Vitae"}</p>
                   <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60 mt-0.5">PDF DOCUMENT • SECURE</p>
                 </div>
               </a>
             )}
             
             <div className="grid grid-cols-2 gap-4">
                {profile.location_url && (
                  <a href={profile.location_url} className="flex flex-col items-center gap-3 py-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all duration-500 group">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100" style={{ color: fontColor }}>{t('publicCard.location')}</span>
                  </a>
                )}
                {profile.google_reviews_url && (
                  <a href={profile.google_reviews_url} className="flex flex-col items-center gap-3 py-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all duration-500 group">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100" style={{ color: fontColor }}>{t('publicCard.reviews')}</span>
                  </a>
                )}
             </div>
          </div>
        )}

        {/* SECTION 4: CONNECTIVITY NODES (LINKS) */}
        {links && links.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 px-2">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30" style={{ color: fontColor }}>{t('publicCard.connectivityHub')}</span>
               <div className="flex-1 h-[1px] bg-white/5" />
            </div>
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 px-6 py-5 rounded-[2.2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-700 group relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-[1.2rem] bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all duration-700">
                  <Globe className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: fontColor }} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-bold tracking-tight" style={{ color: fontColor }}>
                    {link.platform}
                  </p>
                  <p className="text-[10px] font-medium opacity-30 tracking-wide" style={{ color: fontColor }}>{t('publicCard.externalNode') || "Connect Externally"}</p>
                </div>
                <ExternalLink className="w-4 h-4 opacity-10 group-hover:opacity-40 transition-opacity" style={{ color: fontColor }} />
              </a>
            ))}
          </div>
        )}

        {/* SECTION 5: SHOWCASE */}
        {isBusiness && (products.length > 0 || profile.catalogue_url) && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-2">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30" style={{ color: fontColor }}>{t('publicCard.businessShowcase')}</span>
               {profile.catalogue_url && (
                 <a 
                   href={profile.catalogue_url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center gap-2"
                 >
                   <Download className="w-3.5 h-3.5" />
                   {t('publicCard.viewCatalogue')}
                 </a>
               )}
            </div>
            
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="p-5 rounded-[2.2rem] bg-white/[0.02] border border-white/5 flex gap-5 hover:bg-white/[0.04] transition-all duration-700 group/prod">
                   <div className="relative w-20 h-20 rounded-[1.5rem] bg-white/5 border border-white/5 overflow-hidden">
                     {product.image_url ? (
                       <Image 
                         src={product.image_url} 
                         alt={product.name} 
                         fill
                         className="object-cover group-hover/prod:scale-110 transition-transform duration-[2s]" 
                       />
                     ) : (
                       <Package className="w-8 h-8 opacity-10 m-auto mt-6" />
                     )}
                   </div>
                   <div className="flex-1 min-w-0 py-1">
                     <div className="flex items-start justify-between">
                       <p className="text-[14px] font-bold tracking-tight truncate" style={{ color: fontColor }}>{product.name}</p>
                       <p className="text-[11px] font-black text-emerald-400/80 ml-2">{product.price || t('userDashboard.priceOnRequest')}</p>
                     </div>
                     <p className="text-[11px] line-clamp-2 mt-2 leading-relaxed opacity-40 font-medium" style={{ color: fontColor }}>{product.description}</p>
                     {product.external_link && (
                       <a 
                        href={product.external_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-[9px] font-black uppercase tracking-widest text-emerald-400/60 hover:text-emerald-400 transition-colors"
                       >
                         {t('publicCard.viewProduct') || "View Item"}
                         <ExternalLink className="w-3 h-3" />
                       </a>
                     )}
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: CAPTURE HUB */}
        <div className="rounded-[2.5rem] overflow-hidden">
            <LeadCaptureForm userId={profile.id} />
        </div>

        {/* ACTION SHEET: SAVE TO CONTACTS */}
        <div className="pt-8">
          <a 
            href={vcardUrl} 
            download={`${profile.name}.vcf`}
            className="w-full flex items-center justify-center gap-4 py-6 rounded-[2.2rem] bg-emerald-500 text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-500 group overflow-hidden relative"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1s] ease-in-out" />
             <Download className="w-5 h-5 group-hover:bounce" />
             {t('publicCard.completeConnect')}
          </a>
        </div>

        {/* GLOBAL FOOTER */}
        <div className="text-center pt-8 pb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.5em] opacity-20 hover:opacity-40 transition-opacity"
            style={{ color: fontColor }}
          >
            CARTALIK • {t('publicCard.poweredBy')}
          </Link>
        </div>
      </div>
    </div>
  );
}

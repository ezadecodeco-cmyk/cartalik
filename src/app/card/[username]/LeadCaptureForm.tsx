"use client";

import { useState } from "react";
import { UserPlus, Loader2, CheckCircle, X } from "lucide-react";
import { submitLead } from "./actions";
import { useLocale } from "@/context/LocaleContext";

interface LeadCaptureFormProps {
  userId: string;
}

export default function LeadCaptureForm({ userId }: LeadCaptureFormProps) {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setErrorMsg("");
    try {
      await submitLead(formData, userId, 'NFC'); // Pass NFC or QR based on URL param if available
      setIsSuccess(true);
      setTimeout(() => setIsOpen(false), 3000);
    } catch (error: any) {
      setErrorMsg(error.message || t('leadCapture.failedToSubmit') || "Failed to submit. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-4 py-8 rounded-[2.2rem] bg-white/[0.03] border border-white/5 text-white font-black uppercase tracking-[0.4em] text-[10px] transition-all duration-500 hover:bg-white/[0.08] group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <UserPlus className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:text-emerald-400 transition-all duration-500" />
        {t('leadCapture.shareButton') || "Exchange Contact"}
      </button>
    );
  }

  return (
    <div className="w-full bg-black/40 border border-white/5 backdrop-blur-3xl shadow-2xl rounded-[2.5rem] p-8 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700">
      {isSuccess ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
            {t('leadCapture.successTitle') || "Successfully Shared"}
          </h3>
          <p className="text-xs text-slate-500 font-medium tracking-wide">
            {t('leadCapture.successDesc') || "We'll stay in touch."}
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/20 hover:text-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              <UserPlus className="w-5 h-5 text-emerald-400 opacity-80" />
              {t('leadCapture.formTitle') || "Registry Connection"}
            </h3>
            <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-[0.2em] pl-8">
              {t('leadCapture.formDesc') || "Secure end-to-end data exchange"}
            </p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: t('leadCapture.nameLabel') || "Full Name", name: "name", type: "text", required: true },
                { label: t('leadCapture.phoneLabel') || "Phone Number", name: "phone", type: "tel", required: true },
                { label: t('leadCapture.emailLabel') || "Email Address", name: "email", type: "email", required: false },
                { label: t('leadCapture.companyLabel') || "Company Affiliation", name: "company", type: "text", required: false },
              ].map((field) => (
                <div key={field.name} className="relative group">
                  <input
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    placeholder=" "
                    className="peer w-full px-6 py-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 text-[14px] text-white focus:outline-none focus:border-emerald-500/30 focus:bg-white/[0.05] transition-all duration-500 placeholder:opacity-0"
                  />
                  <label 
                    className="absolute left-6 top-5 text-[11px] font-bold text-slate-600 uppercase tracking-widest pointer-events-none transition-all duration-500 
                    peer-focus:-top-2 peer-focus:text-[9px] peer-focus:text-emerald-400 peer-focus:bg-black peer-px-2
                    peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-emerald-400 peer-[:not(:placeholder-shown)]:bg-black peer-[:not(:placeholder-shown)]:px-2"
                  >
                    {field.label} {field.required && "*"}
                  </label>
                </div>
              ))}
            </div>

            <div className="relative group">
              <textarea
                name="message"
                rows={2}
                placeholder=" "
                className="peer w-full px-6 py-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 text-[14px] text-white focus:outline-none focus:border-emerald-500/30 focus:bg-white/[0.05] transition-all duration-500 placeholder:opacity-0 resize-none"
              />
              <label 
                className="absolute left-6 top-5 text-[11px] font-bold text-slate-600 uppercase tracking-widest pointer-events-none transition-all duration-500 
                peer-focus:-top-2 peer-focus:text-[9px] peer-focus:text-emerald-400 peer-focus:bg-black peer-px-2
                peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-emerald-400 peer-[:not(:placeholder-shown)]:bg-black peer-[:not(:placeholder-shown)]:px-2"
              >
                {t('leadCapture.messageLabel') || "Project Notes"}
              </label>
            </div>

            {errorMsg && (
              <p className="text-[10px] text-red-400 font-bold text-center tracking-widest uppercase animate-shake">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-4 flex items-center justify-center gap-3 py-6 rounded-[1.8rem] bg-emerald-500 text-white font-black uppercase tracking-[0.4em] text-[10px] shadow-lg shadow-emerald-500/10 hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-700 disabled:opacity-50"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? t('leadCapture.submitting') : (t('leadCapture.submitButton') || "Initialize Connection")}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

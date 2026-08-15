"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/public/SectionHeading";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const quoteSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  projectType: z.string().min(1, "Select a project type"),
  budgetRange: z.string().min(1, "Select a budget range"),
  message: z.string().min(10, "Tell us a bit more about the project"),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({ resolver: zodResolver(quoteSchema) });

  const onSubmit = async (values: QuoteFormValues) => {
    setSubmitError(null);
    try {
      const response = await fetch(`${API_URL}/api/v1/enquiries`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(Array.isArray(body.message) ? body.message.join(", ") : body.message ?? "Unable to submit request"); }
      setSubmitted(true);
      reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit request");
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Contact"
        title="Tell us about your project"
        description="We respond to every quote request within one business day."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Contact info + map */}
        <div className="space-y-6">
          <div className="glass-card space-y-4 p-6">
            <div className="flex items-center gap-3 text-sm text-white/80">
              <Mail size={16} className="text-brand-300" /> hello@construction.example
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <Phone size={16} className="text-brand-300" /> +254 700 000 000
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <MapPin size={16} className="text-brand-300" /> Upper Hill, Nairobi, Kenya
            </div>
          </div>

          <div className="glass-card relative h-64 overflow-hidden p-5">
            <div className="blueprint-grid absolute inset-0 opacity-50" />
            <div className="relative flex h-full items-end justify-between">
              <div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-blue-300/60">Project region</p><p className="mt-2 text-lg font-semibold">Nairobi, Kenya</p><p className="mt-1 text-xs text-white/35">Upper Hill / Nairobi CBD corridor</p></div>
              <div className="mb-8 mr-10 flex h-10 w-10 items-center justify-center rounded-full border border-blue-300/40 bg-blue-500/15 text-blue-200 shadow-[0_0_30px_rgba(22,119,255,.3)]"><MapPin size={17}/></div>
            </div>
          </div>
        </div>

        {/* Quote request form */}
        <div id="quote" className="glass-card scroll-mt-24 p-6">
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <CheckCircle2 size={32} className="text-emerald-400" />
              <p className="text-sm font-medium text-white">Request received</p>
              <p className="text-xs text-white/50">
                Someone from our team will follow up within one business day.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs text-brand-300 hover:underline"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">
                    Full name
                  </label>
                  <input className="glass-input" {...register("name")} />
                  {errors.name && <p className="mt-1 text-xs text-red-300">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">Phone</label>
                  <input className="glass-input" {...register("phone")} />
                  {errors.phone && <p className="mt-1 text-xs text-red-300">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-white/70">Email</label>
                <input type="email" className="glass-input" {...register("email")} />
                {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">
                    Project type
                  </label>
                  <select className="glass-input" {...register("projectType")}>
                    <option value="" className="bg-[#0b1a3a]">Select…</option>
                    <option value="commercial" className="bg-[#0b1a3a]">Commercial</option>
                    <option value="residential" className="bg-[#0b1a3a]">Residential</option>
                    <option value="infrastructure" className="bg-[#0b1a3a]">Infrastructure</option>
                    <option value="renovation" className="bg-[#0b1a3a]">Renovation / Retrofit</option>
                  </select>
                  {errors.projectType && (
                    <p className="mt-1 text-xs text-red-300">{errors.projectType.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">
                    Budget range
                  </label>
                  <select className="glass-input" {...register("budgetRange")}>
                    <option value="" className="bg-[#0b1a3a]">Select…</option>
                    <option value="under-50k" className="bg-[#0b1a3a]">Under $50,000</option>
                    <option value="50k-500k" className="bg-[#0b1a3a]">$50,000 – $500,000</option>
                    <option value="500k-5m" className="bg-[#0b1a3a]">$500,000 – $5,000,000</option>
                    <option value="5m-plus" className="bg-[#0b1a3a]">$5,000,000+</option>
                  </select>
                  {errors.budgetRange && (
                    <p className="mt-1 text-xs text-red-300">{errors.budgetRange.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-white/70">
                  Project details
                </label>
                <textarea
                  rows={4}
                  className="glass-input resize-none"
                  placeholder="Location, scope, and timeline…"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-300">{errors.message.message}</p>
                )}
              </div>

              {submitError && <p className="rounded-xl border border-red-400/15 bg-red-500/10 px-3 py-2 text-xs text-red-200">{submitError}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                Submit request
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

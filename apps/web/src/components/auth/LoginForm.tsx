"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Moon, Sun, ShieldCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginFormValues } from "@/lib/auth-schema";
import { loginRequest } from "@/lib/api-client";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"credentials" | "twoFactor">("credentials");
  const [darkMode, setDarkMode] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const result = await loginRequest(values);

      if (result.requiresTwoFactor) {
        setStep("twoFactor");
        return;
      }

      if (!result.requiresTwoFactor && result.user) {
        router.push("/dashboard");
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`glass-card w-full max-w-md p-8 ${darkMode ? "text-white" : "text-slate-900"}`}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="overflow-hidden rounded-xl border border-blue-300/15 bg-black">
            <img src="/brand/bubble-engineering-logo.jpeg" alt="BUBBLE Engineering" className="h-10 w-20 object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">BUBBLE Command Center</p>
            <motion.p
              className="text-xs text-white/50"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Building what's next.
            </motion.p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDarkMode((d) => !d)}
          className="rounded-full border border-white/15 p-2 transition hover:bg-white/10"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === "credentials" ? (
          <motion.form
            key="credentials"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Email</label>
              <input
                type="email"
                autoComplete="email"
                className="glass-input"
                placeholder="you@company.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="glass-input pr-10"
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-white/70">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-brand-500" {...register("rememberMe")} />
                Remember me
              </label>
              <a href="/contact" className="hover:text-white">
                Forgot password?
              </a>
            </div>

            {serverError && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Sign in
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="twoFactor"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-sm text-white/80">
              <ShieldCheck size={18} className="text-brand-300" />
              Enter the 6-digit code from your authenticator app
            </div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              className="glass-input text-center tracking-[0.5em]"
              placeholder="••••••"
              {...register("twoFactorCode")}
            />
            {errors.twoFactorCode && (
              <p className="text-xs text-red-300">{errors.twoFactorCode.message}</p>
            )}
            {serverError && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {serverError}
              </p>
            )}
            <input type="hidden" {...register("email")} value={getValues("email")} />
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Verify &amp; continue
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

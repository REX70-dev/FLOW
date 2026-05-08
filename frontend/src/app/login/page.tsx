"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, BrainCircuit } from "lucide-react";
import { buildFallbackSession, getSession, saveSession } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api/v1";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const body = new URLSearchParams();
      body.set("username", email);
      body.set("password", password);

      const response = await fetch(`${API_BASE_URL}/auth/login/access-token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!response.ok) {
        throw new Error("Unable to sign in. Please check your credentials.");
      }

      const data = (await response.json()) as { access_token: string };
      const previous = getSession();
      saveSession({
        ...(previous ?? buildFallbackSession(email)),
        token: data.access_token,
        email,
      });
      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-border/80 bg-white/85 shadow-[0_32px_120px_rgba(11,31,64,0.09)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-[linear-gradient(155deg,rgba(15,58,98,0.98),rgba(9,143,184,0.92))] p-8 text-white md:p-12">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-white/12">
            <BrainCircuit className="h-7 w-7" />
          </div>
          <h1 className="mt-8 font-heading text-4xl font-semibold tracking-tight md:text-5xl">Return to your study engine.</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/76">
            Continue your AI-powered learning flow with revision tracking, weak-topic detection, and multi-modal study
            material generation.
          </p>
          <div className="mt-10 rounded-[1.5rem] border border-white/15 bg-white/8 p-5 text-sm leading-7 text-white/78">
            Designed for learners who want summaries, question generation, spaced repetition, and concept linking in one
            focused workflow.
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="max-w-md">
            <p className="text-sm uppercase tracking-[0.24em] text-primary">FLOW access</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold">Sign in</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              New here?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Create a category-aware account
              </Link>
              .
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required className="h-12 rounded-xl" placeholder="you@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="h-12 rounded-xl"
                  placeholder="Enter your password"
                />
              </div>

              {error ? <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p> : null}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Enter Dashboard"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

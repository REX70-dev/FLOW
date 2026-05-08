"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Brain, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSession, USER_CATEGORIES, type UserCategory } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api/v1";

const categoryBenefits: Record<UserCategory, string> = {
  "School / Boards": "Board-friendly summaries, chapter recall, and simple explanation depth.",
  "JEE / NEET": "Tougher question framing, formula retention, and high-pressure revision cycles.",
  College: "Lecture compression, examples, and concept-to-concept understanding.",
  Medical: "High-yield recall, system links, and mechanism-focused revision loops.",
};

export default function SignupPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<UserCategory>("School / Boards");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const fullName = String(form.get("fullName") ?? "");
    const targetExam = String(form.get("targetExam") ?? "");
    const studyGoal = String(form.get("studyGoal") ?? "");
    const category = String(form.get("category") ?? "School / Boards") as UserCategory;

    try {
      const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          category,
        }),
      });

      if (!signupResponse.ok) {
        const body = await signupResponse.text();
        throw new Error(body || "Unable to create account.");
      }

      const loginPayload = new URLSearchParams();
      loginPayload.set("username", email);
      loginPayload.set("password", password);

      const loginResponse = await fetch(`${API_BASE_URL}/auth/login/access-token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: loginPayload,
      });

      if (!loginResponse.ok) {
        throw new Error("Account created, but automatic sign-in failed.");
      }

      const loginData = (await loginResponse.json()) as { access_token: string };
      saveSession({
        token: loginData.access_token,
        email,
        fullName,
        category,
        targetExam,
        studyGoal,
      });

      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Signup failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-border/80 bg-white/90 shadow-[0_32px_120px_rgba(11,31,64,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-border/80 bg-secondary/50 p-8 lg:border-b-0 lg:border-r lg:p-12">
          <p className="text-sm uppercase tracking-[0.24em] text-primary">Learner setup</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">Create a category-aware AI study profile.</h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            FLOW tunes its summaries, explanations, revision loops, and test style based on how you learn and what you
            are preparing for.
          </p>

          <div className="mt-8 space-y-4">
            {USER_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                  selectedCategory === category
                    ? "border-primary bg-primary/8"
                    : "border-border bg-white hover:border-primary/35"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-heading text-lg font-semibold">{category}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{categoryBenefits[category]}</p>
                  </div>
                  {selectedCategory === category ? <CheckCircle2 className="h-5 w-5 text-primary" /> : null}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 lg:p-12">
          <div className="max-w-xl">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Brain className="h-6 w-6" />
            </div>
            <h2 className="mt-6 font-heading text-3xl font-semibold">Start your FLOW workspace</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in here
              </Link>
              .
            </p>

            <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" name="fullName" required className="h-12 rounded-xl" placeholder="Risha Kumar" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Learning category</Label>
                  <select
                    id="category"
                    name="category"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value as UserCategory)}
                    className="h-12 w-full rounded-xl border border-input bg-white px-4 text-sm outline-none focus:border-ring"
                  >
                    {USER_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required className="h-12 rounded-xl" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required className="h-12 rounded-xl" placeholder="Create a password" />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="targetExam">Target exam or focus</Label>
                  <Input id="targetExam" name="targetExam" className="h-12 rounded-xl" placeholder="CBSE Term 2, NEET, MBBS Pathology..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studyGoal">Current study goal</Label>
                  <Input id="studyGoal" name="studyGoal" className="h-12 rounded-xl" placeholder="Revise 3 weak chapters this week" />
                </div>
              </div>

              {error ? <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p> : null}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {isLoading ? "Creating account..." : "Create AI Learning Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

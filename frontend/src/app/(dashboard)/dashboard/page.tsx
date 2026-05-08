"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, BrainCircuit, CheckSquare, Clock3, Flame, PlusCircle, Radar, ScanText, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryProfiles, getSession, type UserSession } from "@/lib/auth";

const statIcons = [BookOpen, CheckSquare, Clock3, Flame];

export default function DashboardPage() {
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const profile = useMemo(() => {
    return categoryProfiles[session?.category ?? "School / Boards"];
  }, [session]);

  const stats = [
    { label: "Materials transformed", value: "18", note: "Across OCR, PDFs, and lecture transcripts" },
    { label: "Revision completion", value: "76%", note: "Daily recall loop completion this week" },
    { label: "AI tests generated", value: "14", note: "Mixed MCQ, recall, and weak-topic drills" },
    { label: "Momentum streak", value: "9 days", note: "Revision or ingestion completed each day" },
  ];

  const activePipelines = [
    { title: "OCR to study brief", description: "Turn handwritten notes into summaries, key points, and revision bullets." },
    { title: "YouTube to concept digest", description: "Convert long lecture videos into chapter-like study sections." },
    { title: "Weak-topic revision loop", description: "Use performance signals to resurface topics before they decay." },
  ];

  return (
    <div className="p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.24em] text-primary">Mission control</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight">
            {session?.fullName ? `Welcome back, ${session.fullName}.` : "Build your adaptive learning loop."}
          </h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            FLOW is positioned as a multi-modal AI learning workspace: ingest material, compress it into understanding,
            test it, and keep weak topics moving through revision loops.
          </p>
        </div>

        <Link
          href="/upload"
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" />
          Ingest New Material
        </Link>
      </div>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[1.75rem] bg-[linear-gradient(145deg,rgba(15,58,98,0.98),rgba(9,143,184,0.92))] p-7 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.22em] text-white/70">Active learner profile</p>
          <h2 className="mt-4 font-heading text-3xl font-semibold">{session?.category ?? "School / Boards"}</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/78">{profile.focus}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Current goal</p>
              <p className="mt-3 text-sm leading-7">{session?.studyGoal || "Convert raw study input into a revision-friendly knowledge system."}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Target track</p>
              <p className="mt-3 text-sm leading-7">{session?.targetExam || "Personalized exam-oriented outputs are ready to be layered in."}</p>
            </div>
          </div>
        </div>

        <Card className="rounded-[1.75rem] bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radar className="h-5 w-5 text-primary" />
              Weakness signal preview
            </CardTitle>
            <CardDescription>Seeded from the selected learner category until live analytics are connected.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.weakTopics.map((topic) => (
              <div key={topic} className="rounded-2xl border border-border bg-secondary/50 px-4 py-3">
                <p className="font-medium">{topic}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = statIcons[index];
          return (
            <Card key={stat.label} className="rounded-[1.5rem] bg-white/90">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="mt-2 text-3xl">{stat.value}</CardTitle>
                </div>
                <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">{stat.note}</CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[1.75rem] bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              AI workflow layers
            </CardTitle>
            <CardDescription>Core capabilities already represented in the product direction.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {activePipelines.map((pipeline) => (
              <div key={pipeline.title} className="rounded-2xl border border-border bg-secondary/45 p-4">
                <p className="font-heading text-lg font-semibold">{pipeline.title}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{pipeline.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Recommended next moves
            </CardTitle>
            <CardDescription>Category-aware actions for a stronger first-run experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.nextActions.map((action) => (
              <div key={action} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
                <span className="text-sm font-medium">{action}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
            <Link
              href="/study/recent"
              className="mt-2 flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 font-medium text-accent-foreground transition hover:opacity-90"
            >
              <ScanText className="h-4 w-4" />
              Open a sample study brief
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, BrainCircuit, FileText, Network, ScanText, Sparkles, Video } from "lucide-react";

const pillars = [
  {
    title: "Multi-modal ingestion",
    description: "Upload handwritten notes, PDFs, screenshots, or a YouTube lecture and convert them into a structured study source.",
    icon: ScanText,
  },
  {
    title: "AI learning engine",
    description: "Generate summaries, key points, examples, formulae, related topics, and exam-style recall material.",
    icon: BrainCircuit,
  },
  {
    title: "Revision intelligence",
    description: "Move from passive notes to active recall with tests, spaced repetition, weak-topic loops, and next-best actions.",
    icon: Network,
  },
];

const sources = [
  { label: "Handwritten notes", icon: FileText },
  { label: "Printed PDFs", icon: ScanText },
  { label: "Lecture videos", icon: Video },
  { label: "Exam revision briefs", icon: Sparkles },
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-border/80 bg-white/85 p-6 shadow-[0_30px_120px_rgba(14,38,74,0.08)] backdrop-blur md:p-10">
          <header className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Intelligent Multi-Modal AI Learning Platform
              </p>
              <h1 className="mt-6 max-w-4xl font-heading text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
                Build study systems, not just summaries.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                FLOW turns raw educational inputs into category-aware learning briefs, revision loops, concept links,
                and test-ready outputs for school, entrance prep, college, and medical learners.
              </p>
            </div>

            <div className="w-full max-w-sm rounded-[1.75rem] bg-[linear-gradient(145deg,rgba(11,145,187,0.92),rgba(32,52,98,0.96))] p-6 text-white shadow-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-white/70">Platform Promise</p>
              <div className="mt-6 space-y-4">
                {sources.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-sm leading-7 text-white/78">
                From OCR and transcription to weak-topic detection and smart revision, this is designed like a real AI
                learning operating system.
              </p>
            </div>
          </header>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Start Building Your Study Engine
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-border bg-secondary px-6 py-4 font-semibold text-foreground transition hover:bg-accent"
            >
              Continue Existing Session
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.title} className="rounded-[1.75rem] border border-border/80 bg-white/80 p-7 shadow-sm backdrop-blur">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 font-heading text-2xl font-semibold">{pillar.title}</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">{pillar.description}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brain, FileText, Lightbulb, Network, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type StudyMaterial = {
  title: string;
  summary: string;
  key_points?: string[];
  revision_notes?: string[];
  related_topics?: string[];
};

const sampleMaterial: StudyMaterial = {
  title: "Adaptive Photosynthesis Brief",
  summary:
    "This study brief represents the intended FLOW output model: compress raw source content into a digestible explanation, preserve high-yield recall hooks, and surface related topics for active revision.",
  key_points: [
    "Summaries should translate raw material into concept-first explanations.",
    "Key points should act as exam-oriented recall anchors.",
    "Each study brief should become a launch point for tests and revision loops.",
  ],
  revision_notes: [
    "Keep high-yield formulae and definitions in short memory-friendly bullets.",
    "Weak-topic questions should be regenerated from these notes.",
    "Study briefs should connect to related topics and future material recommendations.",
  ],
  related_topics: ["Revision scheduling", "Weak-topic remediation", "Concept graph expansion"],
};

export default function StudyViewerPage() {
  const [studyMaterial, setStudyMaterial] = useState<StudyMaterial>(sampleMaterial);

  useEffect(() => {
    const raw = window.localStorage.getItem("currentStudyMaterial");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      setStudyMaterial({
        title: "Recently Generated Study Brief",
        summary: String(parsed.summary ?? sampleMaterial.summary),
        key_points: Array.isArray(parsed.key_points) ? (parsed.key_points as string[]) : sampleMaterial.key_points,
        revision_notes: Array.isArray(parsed.revision_notes)
          ? (parsed.revision_notes as string[])
          : sampleMaterial.revision_notes,
        related_topics: sampleMaterial.related_topics,
      });
    } catch {
      setStudyMaterial(sampleMaterial);
    }
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">{studyMaterial.title}</h1>
          <p className="mt-2 flex items-center gap-2 text-muted-foreground">
            <PlayCircle className="h-4 w-4" />
            Multi-modal output designed for summary, recall, testing, and linked-topic learning
          </p>
        </div>
        <Link href="/tests/demo">
          <Button className="h-12 gap-2 rounded-xl px-6 text-base">
            <Brain className="h-5 w-5" />
            Launch Assessment
          </Button>
        </Link>
      </div>

      <div className="grid gap-8">
        <Card className="rounded-[1.75rem] border-primary/10 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <FileText className="h-5 w-5" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-8 text-foreground/90">{studyMaterial.summary}</p>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="rounded-[1.75rem]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[oklch(0.72_0.16_88)]" />
                Key Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {studyMaterial.key_points?.map((point, index) => (
                  <li key={index} className="flex gap-3 leading-7 text-foreground/85">
                    <span className="font-bold text-primary">*</span>
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Revision Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {studyMaterial.revision_notes?.map((note, index) => (
                  <li key={index} className="rounded-2xl border border-border bg-secondary/40 p-4 font-medium text-foreground/85">
                    {note}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[1.75rem]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" />
              Related Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {studyMaterial.related_topics?.map((topic) => (
              <span key={topic} className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium">
                {topic}
              </span>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

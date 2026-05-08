import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, FileText, Lightbulb, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function StudyViewerPage({ params }: { params: { id: string } }) {
  // Mock data representing the LLM output
  const studyMaterial = {
    title: "Photosynthesis & Plant Biology",
    summary: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water. Photosynthesis in plants generally involves the green pigment chlorophyll and generates oxygen as a byproduct.",
    keyPoints: [
      "Occurs in the chloroplasts of plant cells.",
      "Requires sunlight, carbon dioxide, and water.",
      "Produces glucose (sugar) and oxygen.",
      "The Light-dependent reactions happen in the thylakoid membrane.",
      "The Calvin cycle (dark reactions) happens in the stroma."
    ],
    revisionNotes: [
      "Formula: 6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2",
      "Chlorophyll a is the primary pigment.",
      "Stomata are pores on the leaf surface that allow CO2 in and O2 out."
    ]
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{studyMaterial.title}</h1>
          <p className="text-gray-500 flex items-center gap-2 mt-2">
            <PlayCircle className="w-4 h-4" /> Source: YouTube Video
          </p>
        </div>
        <Link href={`/tests/demo`}>
          <Button className="bg-green-600 hover:bg-green-700 text-white gap-2 text-lg h-12 px-6">
            <Brain className="w-5 h-5" />
            Generate Assessment
          </Button>
        </Link>
      </div>

      <div className="grid gap-8">
        {/* Summary Section */}
        <Card className="border-blue-100 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <FileText className="w-5 h-5" /> Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {studyMaterial.summary}
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Key Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" /> Key Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {studyMaterial.keyPoints.map((point, index) => (
                  <li key={index} className="flex gap-3 text-gray-700 dark:text-gray-300">
                    <span className="text-blue-500 font-bold">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Revision Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" /> Revision Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {studyMaterial.revisionNotes.map((note, index) => (
                  <li key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 font-medium">
                    {note}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

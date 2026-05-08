"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, FileText, Image as ImageIcon, Loader2, Network, Radar, Upload, Youtube } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fetchAPI } from "@/lib/api";

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState<"youtube" | "pdf" | "image">("youtube");
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("Extracting intelligence...");
  const router = useRouter();

  const pollStatus = async (taskId: string) => {
    try {
      const result = await fetchAPI(`/ingest/status/${taskId}`);

      if (result.status === "completed") {
        setIsLoading(false);
        localStorage.setItem("currentStudyMaterial", JSON.stringify(result.study_material));
        router.push("/study/recent");
      } else {
        setStatusMessage(`Status: ${String(result.status).replace("_", " ")}...`);
        setTimeout(() => {
          void pollStatus(taskId);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      window.alert("Failed to process material.");
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setStatusMessage("Initiating request...");

    try {
      const taskId = `task_${Date.now()}`;

      if (activeTab === "youtube") {
        await fetchAPI("/ingest/youtube", {
          method: "POST",
          body: JSON.stringify({ url, task_id: taskId }),
        });
        void pollStatus(taskId);
      } else {
        setIsLoading(false);
        window.alert("File upload UX is now product-positioned, but a binary file submission flow still needs to be connected in the Next frontend.");
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      window.alert("Error starting ingestion.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-primary">Input engine</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight">Turn raw content into a study system.</h1>
        <p className="mt-3 text-muted-foreground">
          Ingest lectures, scanned notes, or documents and let FLOW transform them into summaries, revision notes,
          and test-ready knowledge blocks.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="rounded-[1.5rem] bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BrainCircuit className="h-5 w-5 text-primary" />
              AI structuring
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            Generate summaries, key points, revision notes, and concept-level understanding from each ingestion.
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Network className="h-5 w-5 text-primary" />
              Topic linking
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            Prepare material for related-topic expansion, weak-topic loops, and future knowledge graph features.
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Radar className="h-5 w-5 text-primary" />
              Revision-ready outputs
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            Every material is intended to flow into testing, active recall, and personalized revision schedules.
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-4">
        <Button variant={activeTab === "youtube" ? "default" : "outline"} onClick={() => setActiveTab("youtube")} className="gap-2">
          <Youtube className="h-4 w-4" />
          YouTube
        </Button>
        <Button variant={activeTab === "pdf" ? "default" : "outline"} onClick={() => setActiveTab("pdf")} className="gap-2">
          <FileText className="h-4 w-4" />
          PDF Document
        </Button>
        <Button variant={activeTab === "image" ? "default" : "outline"} onClick={() => setActiveTab("image")} className="gap-2">
          <ImageIcon className="h-4 w-4" />
          Image / Notes
        </Button>
      </div>

      <Card className="rounded-[1.75rem] border-gray-200 bg-white/90 shadow-lg dark:border-gray-800">
        <CardHeader>
          <CardTitle>
            {activeTab === "youtube" && "YouTube lecture ingestion"}
            {activeTab === "pdf" && "PDF ingestion"}
            {activeTab === "image" && "Image notes ingestion"}
          </CardTitle>
          <CardDescription>
            {activeTab === "youtube" && "Paste a public lecture or concept video to generate an AI study brief."}
            {activeTab === "pdf" && "Upload notes, slides, or chapters to extract a revision-oriented structure."}
            {activeTab === "image" && "Upload a handwritten page or screenshot to start the OCR pipeline."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-6">
            {activeTab === "youtube" ? (
              <div className="space-y-2">
                <Label htmlFor="youtube-url">Video link</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  required
                  className="h-12 rounded-xl"
                />
              </div>
            ) : (
              <div className="rounded-[1.5rem] border-2 border-dashed border-gray-300 p-12 text-center transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900">
                <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p>
                <p className="mt-1 text-xs text-gray-500">Maximum file size: 50MB</p>
                <Input type="file" className="hidden" id="file-upload" />
              </div>
            )}

            <Button type="submit" className="h-12 w-full rounded-xl text-lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {statusMessage}
                </>
              ) : (
                "Generate study material"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

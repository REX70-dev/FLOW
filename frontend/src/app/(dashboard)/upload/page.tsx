"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Youtube, Image as ImageIcon, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState<"youtube" | "pdf" | "image">("youtube");
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("Extracting Intelligence...");
  const router = useRouter();

  const pollStatus = async (taskId: string) => {
    try {
      const result = await fetchAPI(`/ingest/status/${taskId}`);
      
      if (result.status === "completed") {
        setIsLoading(false);
        // We will store the result in localStorage temporarily to pass it to the study viewer
        localStorage.setItem("currentStudyMaterial", JSON.stringify(result.study_material));
        router.push("/study/recent");
      } else {
        setStatusMessage(`Status: ${result.status.replace("_", " ")}...`);
        setTimeout(() => pollStatus(taskId), 3000);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      alert("Failed to process material.");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage("Initiating request...");
    
    try {
      const taskId = `task_${Date.now()}`;
      
      if (activeTab === "youtube") {
        await fetchAPI("/ingest/youtube", {
          method: "POST",
          body: JSON.stringify({ url, task_id: taskId }),
        });
        pollStatus(taskId);
      } else {
        // Handle PDF/Image upload logic here
        setIsLoading(false);
        alert("File uploads require a file input to be implemented in the demo.");
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alert("Error starting ingestion.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Ingest New Material</h1>
        <p className="text-gray-500">Upload a PDF, Image, or paste a YouTube link to generate AI study material.</p>
      </div>

      <div className="flex justify-center mb-8 space-x-4">
        <Button 
          variant={activeTab === "youtube" ? "default" : "outline"} 
          onClick={() => setActiveTab("youtube")}
          className="gap-2"
        >
          <Youtube className="w-4 h-4" /> YouTube
        </Button>
        <Button 
          variant={activeTab === "pdf" ? "default" : "outline"} 
          onClick={() => setActiveTab("pdf")}
          className="gap-2"
        >
          <FileText className="w-4 h-4" /> PDF Document
        </Button>
        <Button 
          variant={activeTab === "image" ? "default" : "outline"} 
          onClick={() => setActiveTab("image")}
          className="gap-2"
        >
          <ImageIcon className="w-4 h-4" /> Image / Notes
        </Button>
      </div>

      <Card className="shadow-lg border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>
            {activeTab === "youtube" && "YouTube URL"}
            {activeTab === "pdf" && "Upload PDF"}
            {activeTab === "image" && "Upload Image"}
          </CardTitle>
          <CardDescription>
            {activeTab === "youtube" && "Paste a public YouTube lecture or tutorial link."}
            {activeTab === "pdf" && "Upload your course notes, slides, or textbook chapter in PDF format."}
            {activeTab === "image" && "Upload a photo of your handwritten notes or a textbook page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-6">
            {activeTab === "youtube" ? (
              <div className="space-y-2">
                <Label htmlFor="youtube-url">Video Link</Label>
                <Input 
                  id="youtube-url" 
                  placeholder="https://youtube.com/watch?v=..." 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required 
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">Maximum file size: 50MB</p>
                <Input type="file" className="hidden" id="file-upload" />
              </div>
            )}
            
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {statusMessage}
                </>
              ) : (
                "Generate Study Material"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

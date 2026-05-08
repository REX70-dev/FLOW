import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckSquare, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Pick up where you left off.</p>
        </div>
        <Link href="/upload" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          <PlusCircle className="h-5 w-5" />
          New Material
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">+2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assessments Taken</CardTitle>
            <CheckSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500">Avg Score: 85%</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mt-12 mb-4">Recent Materials</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Placeholder data */}
        <Link href="/study/1">
          <Card className="hover:border-blue-500 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Photosynthesis & Plant Biology</CardTitle>
              <CardDescription>Generated from YouTube Video</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/study/2">
          <Card className="hover:border-blue-500 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Calculus Chapter 4 Notes</CardTitle>
              <CardDescription>Generated from PDF Upload</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}

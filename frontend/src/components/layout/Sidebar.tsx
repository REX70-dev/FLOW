import Link from "next/link";
import { Home, Upload, BookOpen, CheckSquare, LogOut } from "lucide-react";

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-gray-50 dark:bg-gray-900/50">
      <div className="flex h-14 items-center border-b px-4 font-bold text-lg text-blue-600">
        AI Learning
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-2 px-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/upload"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Upload className="h-4 w-4" />
            Upload & Ingest
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <BookOpen className="h-4 w-4" />
            Study Materials
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <CheckSquare className="h-4 w-4" />
            Assessments
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-950/50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Link>
      </div>
    </div>
  );
}

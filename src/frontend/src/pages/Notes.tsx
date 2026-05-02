import type { Note } from "@/backend.d";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotes } from "@/hooks/useQueries";
import { formatDate } from "@/lib/utils";
import { AlertCircle, BookOpen, FileText, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const SUBJECTS = [
  "All",
  "CS",
  "Math",
  "Physics",
  "DSA",
  "OS",
  "Networks",
  "DBMS",
];

function NoteCardSkeleton() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

function NoteCard({ note }: { note: Note }) {
  const isPdf = note.fileType === "pdf";
  const href = `/notes/${note.id.toString()}`;

  return (
    <Card
      data-ocid={`notes.item.${note.id.toString()}`}
      className="border-border hover:shadow-md transition-smooth group flex flex-col"
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div
            className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${
              isPdf ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
            }`}
          >
            <FileText className="h-4 w-4" />
          </div>
          <Badge
            variant={isPdf ? "default" : "secondary"}
            className="shrink-0 text-xs"
          >
            {isPdf ? "PDF" : "Text"}
          </Badge>
        </div>
        <CardTitle className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors mt-2 line-clamp-2">
          {note.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-3">
        <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
          {note.description || "No description provided."}
        </p>
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <div className="flex flex-col gap-0.5">
            <Badge variant="outline" className="text-xs w-fit">
              {note.subject}
            </Badge>
            <span className="text-[11px] text-muted-foreground mt-1">
              {formatDate(note.uploadDate)}
            </span>
          </div>
          <a href={href}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-ocid={`notes.view_button.${note.id.toString()}`}
              className="text-xs"
            >
              View
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NotesPage() {
  const { data: notes, isLoading, isError } = useNotes();

  const [searchInput, setSearchInput] = useState("");
  const [activeSubject, setActiveSubject] = useState("All");

  // Sync subject filter from URL search param ?subject=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subjectParam = params.get("subject");
    if (subjectParam) setActiveSubject(subjectParam);
  }, []);

  // Persist subject in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeSubject === "All") {
      params.delete("subject");
    } else {
      params.set("subject", activeSubject);
    }
    const newUrl =
      window.location.pathname +
      (params.toString() ? `?${params.toString()}` : "");
    window.history.replaceState(null, "", newUrl);
  }, [activeSubject]);

  const filtered = useMemo(() => {
    if (!notes) return [];
    return notes.filter((n) => {
      const matchesSearch =
        !searchInput ||
        n.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        n.subject.toLowerCase().includes(searchInput.toLowerCase());
      const matchesSubject =
        activeSubject === "All" ||
        n.subject.toLowerCase() === activeSubject.toLowerCase();
      return matchesSearch && matchesSubject;
    });
  }, [notes, searchInput, activeSubject]);

  return (
    <Layout pageTitle="Study Notes">
      {/* Header bar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Study Notes
          </h2>
          <p className="text-sm text-muted-foreground">
            Browse and access subject-wise study materials
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-ocid="notes.search_input"
            placeholder="Search by title or subject..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Subject filter tabs */}
      <div data-ocid="notes.filter.tab" className="flex flex-wrap gap-2 mb-5">
        {SUBJECTS.map((subj) => (
          <button
            key={subj}
            type="button"
            onClick={() => setActiveSubject(subj)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-smooth ${
              activeSubject === subj
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div
          data-ocid="notes.loading_state"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => (
            <NoteCardSkeleton key={k} />
          ))}
        </div>
      ) : isError ? (
        <div
          data-ocid="notes.error_state"
          className="flex flex-col items-center justify-center gap-3 py-20 text-center"
        >
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="font-display font-semibold text-foreground">
            Failed to load notes
          </p>
          <p className="text-sm text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="notes.empty_state"
          className="flex flex-col items-center justify-center gap-3 py-20 text-center"
        >
          <BookOpen className="h-10 w-10 text-muted-foreground" />
          <p className="font-display font-semibold text-foreground">
            No notes found
          </p>
          <p className="text-sm text-muted-foreground">
            {searchInput || activeSubject !== "All"
              ? "Try adjusting your search or filter."
              : "No study notes have been uploaded yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((note) => (
            <NoteCard key={note.id.toString()} note={note} />
          ))}
        </div>
      )}
    </Layout>
  );
}

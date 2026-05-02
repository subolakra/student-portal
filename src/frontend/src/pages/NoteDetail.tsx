import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useNoteById } from "@/hooks/useQueries";
import { formatDate } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  FileX,
  Tag,
  User,
} from "lucide-react";

interface NoteDetailPageProps {
  noteId: string;
}

function DetailSkeleton() {
  return (
    <div className="max-w-2xl space-y-5">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-5 w-1/3" />
      <Card>
        <CardContent className="p-5 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-md" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Skeleton className="h-24 w-full rounded-lg" />
    </div>
  );
}

export default function NoteDetailPage({ noteId }: NoteDetailPageProps) {
  const id = BigInt(noteId);
  const { data: note, isLoading, isError } = useNoteById(id);

  const isPdf = note?.fileType === "pdf";
  const hasFile =
    note != null &&
    note.fileKey.trim() !== "" &&
    note.fileKey !== "placeholder";

  function handleDownload() {
    if (!hasFile || !note) return;
    window.open(note.fileKey, "_blank", "noopener,noreferrer");
  }

  return (
    <Layout pageTitle="Note Detail">
      {/* Back nav */}
      <div className="mb-4">
        <a href="/notes">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-ocid="note_detail.back_button"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Button>
        </a>
      </div>

      {isLoading ? (
        <div data-ocid="note_detail.loading_state">
          <DetailSkeleton />
        </div>
      ) : isError ? (
        <div
          data-ocid="note_detail.error_state"
          className="flex flex-col items-center justify-center gap-3 py-20 text-center"
        >
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="font-display font-semibold text-foreground">
            Failed to load note
          </p>
          <p className="text-sm text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      ) : !note ? (
        <div
          data-ocid="note_detail.empty_state"
          className="flex flex-col items-center justify-center gap-3 py-20 text-center"
        >
          <FileX className="h-10 w-10 text-muted-foreground" />
          <p className="font-display font-semibold text-foreground">
            Note not found
          </p>
          <p className="text-sm text-muted-foreground">
            This note may have been removed.
          </p>
        </div>
      ) : (
        <div className="max-w-2xl" data-ocid="note_detail.card">
          {/* Title + badges */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-bold text-foreground leading-snug">
                {note.title}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge
                  variant="outline"
                  className="gap-1 text-xs"
                  data-ocid="note_detail.subject_badge"
                >
                  <Tag className="h-3 w-3" />
                  {note.subject}
                </Badge>
                <Badge
                  variant={isPdf ? "default" : "secondary"}
                  className="gap-1 text-xs"
                  data-ocid="note_detail.filetype_badge"
                >
                  <FileText className="h-3 w-3" />
                  {isPdf ? "PDF" : "Text"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Metadata card */}
          <Card className="mb-4 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Note Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Tag className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                    Subject
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {note.subject}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                    File Type
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {isPdf ? "PDF Document" : "Text Document"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                    Upload Date
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(note.uploadDate)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                    Uploaded By
                  </p>
                  <p className="text-sm font-mono text-foreground truncate">
                    {note.uploadedBy.toText()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {note.description && (
            <Card className="mb-4 border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">
                  {note.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* File download / no-file state */}
          <div
            className={`rounded-xl border p-4 flex items-center justify-between gap-4 ${
              hasFile
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-muted/40"
            }`}
            data-ocid="note_detail.file_section"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                  hasFile
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {hasFile ? (
                  <FileText className="h-5 w-5" />
                ) : (
                  <FileX className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {hasFile ? note.title : "No file attached"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {hasFile
                    ? `${isPdf ? "PDF" : "Text"} document`
                    : "This note does not have a file attached."}
                </p>
              </div>
            </div>
            {hasFile && (
              <Button
                type="button"
                size="sm"
                onClick={handleDownload}
                data-ocid="note_detail.download_button"
                className="gap-1.5 shrink-0"
              >
                <Download className="h-4 w-4" />
                {isPdf ? "Download" : "View"}
              </Button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

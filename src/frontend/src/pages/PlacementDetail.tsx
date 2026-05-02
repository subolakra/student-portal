import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetJobById } from "@/hooks/useQueries";
import { formatDate, isDeadlineSoon } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Download,
  FileText,
  Users,
} from "lucide-react";

interface PlacementDetailProps {
  jobId: bigint;
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PlacementDetailPage({ jobId }: PlacementDetailProps) {
  const { data: job, isLoading, isError } = useGetJobById(jobId);

  const soon = job ? isDeadlineSoon(job.deadline) : false;
  const isPast = job ? new Date(job.deadline) < new Date() : false;

  return (
    <Layout pageTitle="Placement Detail">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <a
          href="/placements"
          data-ocid="placement_detail.back_link"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group no-underline"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Placements
        </a>

        {/* Loading */}
        {isLoading && (
          <div data-ocid="placement_detail.loading_state">
            <DetailSkeleton />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            data-ocid="placement_detail.error_state"
            className="flex flex-col items-center justify-center py-20 gap-3 text-center"
          >
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="font-semibold text-foreground">
              Failed to load job details
            </p>
            <p className="text-sm text-muted-foreground">
              Please go back and try again.
            </p>
          </div>
        )}

        {/* Not found */}
        {!isLoading && !isError && !job && (
          <div
            data-ocid="placement_detail.empty_state"
            className="flex flex-col items-center justify-center py-20 gap-3 text-center"
          >
            <Briefcase className="h-10 w-10 text-muted-foreground" />
            <p className="font-semibold text-foreground">Job not found</p>
            <p className="text-sm text-muted-foreground">
              This listing may have been removed.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              data-ocid="placement_detail.back_button"
            >
              Go Back
            </Button>
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && job && (
          <div data-ocid="placement_detail.card" className="space-y-5">
            {/* Hero section */}
            <Card className="overflow-hidden">
              <div className="bg-primary/10 border-b border-primary/20 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="font-display text-xl font-bold text-foreground">
                        {job.company}
                      </h1>
                      <p className="text-sm text-muted-foreground font-medium">
                        {job.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {!isPast && soon && (
                      <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-xs font-semibold">
                        Deadline Soon!
                      </Badge>
                    )}
                    {isPast && <Badge variant="secondary">Closed</Badge>}
                    {!isPast && !soon && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <CardContent className="pt-5 pb-6 space-y-5">
                {/* Meta row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-3.5">
                    <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Eligibility
                      </p>
                      <p className="text-sm text-foreground">
                        {job.eligibility}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-3.5">
                    <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Application Deadline
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          soon && !isPast
                            ? "text-destructive"
                            : "text-foreground"
                        }`}
                      >
                        {job.deadline}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    About the Role
                  </CardTitle>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>

                <Separator />

                {/* PDF attachment */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Attachment</span>
                  </div>
                  {job.pdfKey ? (
                    <Button
                      type="button"
                      size="sm"
                      data-ocid="placement_detail.download_button"
                      onClick={() =>
                        window.open(
                          `/api/storage/${encodeURIComponent(job.pdfKey)}`,
                          "_blank",
                        )
                      }
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  ) : (
                    <span
                      data-ocid="placement_detail.no_attachment"
                      className="text-sm text-muted-foreground italic"
                    >
                      No attachment
                    </span>
                  )}
                </div>

                <Separator />

                {/* Posted date */}
                <p className="text-xs text-muted-foreground">
                  Posted on {formatDate(job.postedDate)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}

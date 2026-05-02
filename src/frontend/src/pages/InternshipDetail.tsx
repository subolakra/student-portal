import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetInternshipById } from "@/hooks/useQueries";
import { isDeadlineSoon } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  Paperclip,
} from "lucide-react";

interface Props {
  internshipId: bigint;
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-3">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {(["a", "b", "c", "d"] as const).map((k) => (
          <Skeleton key={k} className="h-16 w-full" />
        ))}
      </div>
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default function InternshipDetailPage({ internshipId }: Props) {
  const {
    data: internship,
    isLoading,
    isError,
  } = useGetInternshipById(internshipId);
  const soon = internship ? isDeadlineSoon(internship.deadline) : false;

  return (
    <Layout pageTitle="Internship Details">
      <div className="mb-4">
        <a
          href="/internships"
          data-ocid="internship_detail.back_link"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Internships
        </a>
      </div>

      {isLoading && <LoadingSkeleton />}

      {isError && (
        <div
          data-ocid="internship_detail.error_state"
          className="flex flex-col items-center justify-center py-20 gap-3"
        >
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-sm font-medium text-foreground">
            Failed to load internship details.
          </p>
          <p className="text-xs text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      )}

      {!isLoading && !isError && !internship && (
        <div
          data-ocid="internship_detail.empty_state"
          className="flex flex-col items-center justify-center py-20 gap-3"
        >
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            Internship not found.
          </p>
          <a
            href="/internships"
            className="text-xs text-primary hover:underline"
          >
            View all internships
          </a>
        </div>
      )}

      {!isLoading && !isError && internship && (
        <div className="space-y-6 max-w-3xl">
          {/* Header */}
          <div className="rounded-xl bg-primary px-6 py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-primary-foreground/70" />
                  <span className="text-sm text-primary-foreground/70">
                    {internship.company}
                  </span>
                </div>
                <h1 className="font-display text-xl font-bold text-primary-foreground">
                  {internship.role}
                </h1>
              </div>
              <div className="flex flex-col gap-1.5 items-end shrink-0">
                {internship.isActive ? (
                  <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs">
                    Active
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-xs border-primary-foreground/30 text-primary-foreground/70"
                  >
                    Closed
                  </Badge>
                )}
                {soon && (
                  <Badge variant="destructive" className="text-xs">
                    Closing Soon
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Quick info */}
          <Card data-ocid="internship_detail.info_card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Opportunity Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <DetailRow
                icon={Clock}
                label="Duration"
                value={internship.duration}
              />
              <DetailRow
                icon={DollarSign}
                label="Stipend"
                value={internship.stipend}
              />
              <DetailRow
                icon={Calendar}
                label="Application Deadline"
                value={internship.deadline}
              />
              <DetailRow
                icon={Building2}
                label="Company"
                value={internship.company}
              />
            </CardContent>
          </Card>

          {/* Description */}
          <Card data-ocid="internship_detail.description_card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                About This Internship
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {internship.description}
              </p>
            </CardContent>
          </Card>

          {/* Requirements */}
          {internship.requirements && (
            <Card data-ocid="internship_detail.requirements_card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {internship.requirements
                    .split("\n")
                    .filter(Boolean)
                    .map((req) => (
                      <li
                        key={req.trim().slice(0, 40) || req}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                        <span>{req}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Action buttons */}
          <div
            data-ocid="internship_detail.actions"
            className="flex flex-wrap gap-3"
          >
            {internship.pdfKey ? (
              <Button
                type="button"
                variant="outline"
                data-ocid="internship_detail.download_button"
                className="gap-2"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = internship.pdfKey;
                  link.download = `${internship.company}-${internship.role}.pdf`;
                  link.click();
                }}
              >
                <Download className="h-4 w-4" />
                Download Details PDF
              </Button>
            ) : (
              <div
                data-ocid="internship_detail.no_attachment"
                className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-4 py-2 rounded-lg"
              >
                <Paperclip className="h-4 w-4" />
                No attachment available
              </div>
            )}

            {internship.applicationLink && (
              <Button
                type="button"
                data-ocid="internship_detail.apply_button"
                className="gap-2"
                onClick={() =>
                  window.open(
                    internship.applicationLink,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <ExternalLink className="h-4 w-4" />
                Apply Now
              </Button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

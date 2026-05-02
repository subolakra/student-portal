import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetJobs } from "@/hooks/useQueries";
import { isDeadlineSoon } from "@/lib/utils";
import type { Job } from "@/types/index";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  ChevronRight,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

function JobCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

function JobCard({ job }: { job: Job }) {
  const soon = isDeadlineSoon(job.deadline);
  const deadlineDate = new Date(job.deadline);
  const isPast = deadlineDate < new Date();

  return (
    <a
      href={`/placements/${job.id}`}
      data-ocid={`placements.job.item.${Number(job.id)}`}
      className="block no-underline group"
    >
      <Card className="overflow-hidden hover:shadow-md transition-smooth border-border h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {job.company}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground font-medium truncate pl-10">
                {job.role}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {!isPast && soon && (
                <Badge
                  data-ocid={`placements.deadline_soon.${Number(job.id)}`}
                  className="bg-destructive/15 text-destructive border-destructive/30 text-xs font-semibold"
                >
                  Deadline Soon!
                </Badge>
              )}
              {isPast && (
                <Badge variant="secondary" className="text-xs">
                  Closed
                </Badge>
              )}
              {!isPast && !soon && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 text-xs"
                >
                  Active
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-muted-foreground line-clamp-2">
              <span className="font-medium text-foreground">Eligibility: </span>
              {job.eligibility}
            </p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span
                className={
                  soon && !isPast ? "text-destructive font-semibold" : ""
                }
              >
                Deadline: {job.deadline}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary h-7 px-2 group-hover:bg-primary/10 transition-colors"
            >
              View Details
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

export default function PlacementsPage() {
  const { data: jobs, isLoading, isError } = useGetJobs();
  const [search, setSearch] = useState("");

  const sorted = useMemo(() => {
    const active = (jobs ?? []).filter((j) => j.isActive);
    const filtered = search.trim()
      ? active.filter(
          (j) =>
            j.company.toLowerCase().includes(search.toLowerCase()) ||
            j.role.toLowerCase().includes(search.toLowerCase()),
        )
      : active;
    return [...filtered].sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    );
  }, [jobs, search]);

  return (
    <Layout pageTitle="Placement Opportunities">
      {/* Header banner */}
      <div
        data-ocid="placements.header"
        className="mb-6 rounded-xl bg-primary/10 border border-primary/20 px-6 py-5 flex items-center gap-4"
      >
        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Placement Drives
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore active job drives and campus recruitment opportunities.
          </p>
        </div>
      </div>

      {/* Search & count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-ocid="placements.search_input"
            placeholder="Search by company or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {!isLoading && !isError && (
          <p className="text-sm text-muted-foreground shrink-0">
            {sorted.length}{" "}
            {sorted.length === 1 ? "opportunity" : "opportunities"}
          </p>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          data-ocid="placements.loading_state"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <JobCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          data-ocid="placements.error_state"
          className="flex flex-col items-center justify-center py-16 gap-3"
        >
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-sm text-muted-foreground">
            Failed to load job listings. Please try again.
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && sorted.length === 0 && (
        <div
          data-ocid="placements.empty_state"
          className="flex flex-col items-center justify-center py-16 gap-4 text-center"
        >
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">
              {search ? "No results found" : "No active placements"}
            </p>
            <p className="text-sm text-muted-foreground">
              {search
                ? "Try adjusting your search term."
                : "Check back soon for new placement drives."}
            </p>
          </div>
          {search && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSearch("")}
              data-ocid="placements.clear_search_button"
            >
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* Grid */}
      {!isLoading && !isError && sorted.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((job) => (
            <JobCard key={job.id.toString()} job={job} />
          ))}
        </div>
      )}
    </Layout>
  );
}

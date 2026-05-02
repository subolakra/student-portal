import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetInternships } from "@/hooks/useQueries";
import { isDeadlineSoon } from "@/lib/utils";
import type { Internship } from "@/types/index";
import {
  AlertCircle,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

const DURATION_OPTIONS = ["All", "1 month", "3 months", "6 months"] as const;
type DurationFilter = (typeof DURATION_OPTIONS)[number];

function InternshipCard({ internship }: { internship: Internship }) {
  const soon = isDeadlineSoon(internship.deadline);
  return (
    <a
      href={`/internships/${internship.id}`}
      className="block no-underline"
      data-ocid={`internship.item.${internship.id}`}
    >
      <Card className="h-full hover:shadow-md transition-smooth cursor-pointer border-border group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground truncate">
                  {internship.company}
                </span>
              </div>
              <h3 className="font-display font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2">
                {internship.role}
              </h3>
            </div>
            <div className="shrink-0 flex flex-col gap-1 items-end">
              {internship.isActive ? (
                <Badge
                  variant="secondary"
                  className="text-xs bg-primary/10 text-primary border-0"
                >
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
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

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{internship.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{internship.stipend}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>Deadline: {internship.deadline}</span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

function InternshipSkeletons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(["a", "b", "c", "d", "e", "f"] as const).map((k) => (
        <Card key={k} className="border-border">
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-full" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function InternshipsPage() {
  const [search, setSearch] = useState("");
  const [durationFilter, setDurationFilter] = useState<DurationFilter>("All");
  const { data: internships, isLoading, isError } = useGetInternships();

  const filtered = useMemo(() => {
    if (!internships) return [];
    return internships.filter((i) => {
      const matchSearch =
        search.trim() === "" ||
        i.company.toLowerCase().includes(search.toLowerCase()) ||
        i.role.toLowerCase().includes(search.toLowerCase());
      const matchDuration =
        durationFilter === "All" ||
        i.duration.toLowerCase().includes(durationFilter.toLowerCase());
      return matchSearch && matchDuration && i.isActive;
    });
  }, [internships, search, durationFilter]);

  return (
    <Layout pageTitle="Internships">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Internship Opportunities
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading
              ? "Loading..."
              : `${filtered.length} active internship${filtered.length !== 1 ? "s" : ""} available`}
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            data-ocid="internships.search_input"
            placeholder="Search company or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div
        className="mb-5 flex flex-wrap gap-2"
        data-ocid="internships.duration_filter"
      >
        {DURATION_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setDurationFilter(opt)}
            data-ocid={`internships.filter.${opt.replace(/ /g, "_").toLowerCase()}`}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-smooth border ${
              durationFilter === opt
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {isLoading && <InternshipSkeletons />}

      {isError && (
        <div
          data-ocid="internships.error_state"
          className="flex flex-col items-center justify-center py-16 gap-3"
        >
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-sm font-medium text-foreground">
            Failed to load internships.
          </p>
          <p className="text-xs text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div
          data-ocid="internships.empty_state"
          className="flex flex-col items-center justify-center py-16 gap-3"
        >
          <ExternalLink className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            No internships found
          </p>
          <p className="text-xs text-muted-foreground">
            {search || durationFilter !== "All"
              ? "Try adjusting your filters."
              : "Check back soon for new opportunities."}
          </p>
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          data-ocid="internships.list"
        >
          {filtered.map((internship) => (
            <InternshipCard
              key={internship.id.toString()}
              internship={internship}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}

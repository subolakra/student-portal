import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyProfile } from "@/hooks/useQueries";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  GraduationCap,
  Hash,
  Mail,
  Phone,
  User,
} from "lucide-react";

function ProfileSkeleton() {
  return (
    <div data-ocid="profile.loading_state" className="space-y-6">
      {/* Avatar + Name Card */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-primary/10" />
        <CardContent className="pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <Skeleton className="h-20 w-20 rounded-full ring-4 ring-card shrink-0" />
            <div className="space-y-2 pb-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-36" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  ocid,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  ocid: string;
}) {
  return (
    <div className="flex items-start gap-3" data-ocid={ocid}>
      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground break-words mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

function formatEnrollmentDate(ts: bigint): string {
  try {
    // Backend stores timestamps as nanoseconds (bigint)
    const ms = Number(ts / 1_000_000n);
    if (ms === 0) return "—";
    return new Date(ms).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function getInitials(name: string): string {
  if (!name.trim()) return "S";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useGetMyProfile();

  if (isLoading) {
    return (
      <Layout pageTitle="My Profile">
        <ProfileSkeleton />
      </Layout>
    );
  }

  if (isError || !profile) {
    return (
      <Layout pageTitle="My Profile">
        <div
          data-ocid="profile.error_state"
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Unable to load profile
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            There was a problem fetching your profile. Please try refreshing the
            page.
          </p>
        </div>
      </Layout>
    );
  }

  const initials = getInitials(profile.name);
  const enrollmentDateStr = formatEnrollmentDate(profile.enrollmentDate);

  return (
    <Layout pageTitle="My Profile">
      <div data-ocid="profile.page" className="space-y-6 max-w-4xl">
        {/* Hero Card */}
        <Card data-ocid="profile.hero_card" className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/10" />
          <CardContent className="pb-6 pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
              {/* Avatar */}
              <div
                data-ocid="profile.avatar"
                className="h-20 w-20 rounded-full ring-4 ring-card bg-primary flex items-center justify-center shrink-0 shadow-md"
              >
                <span className="font-display text-xl font-bold text-primary-foreground">
                  {initials}
                </span>
              </div>
              {/* Name + Roll */}
              <div className="flex flex-col gap-1 pb-1 min-w-0">
                <h1
                  data-ocid="profile.name"
                  className="font-display text-2xl font-bold text-foreground truncate"
                >
                  {profile.name || "Student"}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    data-ocid="profile.roll_number"
                    className="font-mono text-sm text-muted-foreground"
                  >
                    {profile.rollNumber || "—"}
                  </span>
                  <Badge
                    data-ocid="profile.year_badge"
                    variant="secondary"
                    className="text-xs"
                  >
                    Year {Number(profile.year)}
                  </Badge>
                  <Badge
                    data-ocid="profile.semester_badge"
                    variant="outline"
                    className="text-xs"
                  >
                    Sem {Number(profile.semester)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Academic Details */}
          <Card data-ocid="profile.academic_card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <GraduationCap className="h-4 w-4 text-primary" />
                Academic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow
                icon={BookOpen}
                label="Course"
                value={profile.course || "—"}
                ocid="profile.course"
              />
              <InfoRow
                icon={GraduationCap}
                label="Year"
                value={`Year ${Number(profile.year)}`}
                ocid="profile.year"
              />
              <InfoRow
                icon={Hash}
                label="Semester"
                value={`Semester ${Number(profile.semester)}`}
                ocid="profile.semester"
              />
              <InfoRow
                icon={Calendar}
                label="Enrollment Date"
                value={enrollmentDateStr}
                ocid="profile.enrollment_date"
              />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card data-ocid="profile.contact_card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <User className="h-4 w-4 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow
                icon={Mail}
                label="Email Address"
                value={profile.email || "—"}
                ocid="profile.email"
              />
              <InfoRow
                icon={Phone}
                label="Phone Number"
                value={profile.phone || "—"}
                ocid="profile.phone"
              />
              <InfoRow
                icon={Hash}
                label="Roll Number"
                value={profile.rollNumber || "—"}
                ocid="profile.roll_number_detail"
              />
              <div
                data-ocid="profile.principal"
                className="flex items-start gap-3"
              >
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-muted text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Principal ID
                  </p>
                  <p className="text-xs font-mono text-foreground break-all mt-0.5">
                    {profile.principal?.toText?.() ?? "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetInternships,
  useGetJobs,
  useGetMyProfile,
  useGetNotes,
} from "@/hooks/useQueries";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Clock,
  GraduationCap,
  User,
} from "lucide-react";

export default function DashboardPage() {
  const { identity } = useAuth();
  const { data: profile, isLoading: profileLoading } = useGetMyProfile();
  const { data: notes = [], isLoading: notesLoading } = useGetNotes();
  const { data: jobs = [], isLoading: jobsLoading } = useGetJobs();
  const { data: internships = [], isLoading: internshipsLoading } =
    useGetInternships();

  const isLoading =
    profileLoading || notesLoading || jobsLoading || internshipsLoading;

  const displayName = profile?.name ?? (identity ? "Student" : "Guest");
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const activeJobs = jobs.filter((j) => j.isActive);
  const activeInternships = internships.filter((i) => i.isActive);
  const semesterProgress = profile
    ? Math.round((Number(profile.semester) / 8) * 100)
    : 0;

  const recentNotes = [...notes]
    .sort((a, b) => Number(b.uploadDate) - Number(a.uploadDate))
    .slice(0, 3);
  const recentJobs = [...activeJobs]
    .sort((a, b) => Number(b.postedDate) - Number(a.postedDate))
    .slice(0, 3);
  const recentInternships = [...activeInternships]
    .sort((a, b) => Number(b.postedDate) - Number(a.postedDate))
    .slice(0, 3);

  const activityFeed = [
    ...recentNotes.map((n) => ({
      type: "note" as const,
      text: `${n.subject} — ${n.title}`,
      date: Number(n.uploadDate),
    })),
    ...recentJobs.map((j) => ({
      type: "job" as const,
      text: `${j.company} — ${j.role}`,
      date: Number(j.postedDate),
    })),
    ...recentInternships.map((i) => ({
      type: "internship" as const,
      text: `${i.company} — ${i.role}`,
      date: Number(i.postedDate),
    })),
  ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 9);

  const quickLinks = [
    {
      label: "Study Notes",
      description: "Browse subject-wise notes and study materials",
      href: "/notes",
      Icon: BookOpen,
      color: "bg-primary/10 text-primary",
      count: notesLoading
        ? null
        : `${notes.length} note${notes.length !== 1 ? "s" : ""}`,
    },
    {
      label: "Placements",
      description: "Latest job listings and placement drives",
      href: "/placements",
      Icon: Briefcase,
      color: "bg-accent/10 text-accent",
      count: jobsLoading ? null : `${activeJobs.length} active`,
    },
    {
      label: "Internships",
      description: "Internship opportunities with leading companies",
      href: "/internships",
      Icon: GraduationCap,
      color: "bg-chart-2/10 text-chart-2",
      count: internshipsLoading ? null : `${activeInternships.length} open`,
    },
    {
      label: "My Profile",
      description: "View and manage your academic details",
      href: "/profile",
      Icon: User,
      color: "bg-secondary text-secondary-foreground",
      count: null,
    },
  ];

  const stats = [
    {
      label: "Study Notes",
      value: notes.length,
      Icon: BookOpen,
      color: "text-primary",
    },
    {
      label: "Job Listings",
      value: activeJobs.length,
      Icon: Briefcase,
      color: "text-accent",
    },
    {
      label: "Internships",
      value: activeInternships.length,
      Icon: GraduationCap,
      color: "text-chart-2",
    },
    {
      label: "Semester Progress",
      value: `${semesterProgress}%`,
      Icon: BarChart3,
      color: "text-chart-4",
    },
  ];

  const activityTypeColor = {
    note: "bg-primary",
    job: "bg-accent",
    internship: "bg-chart-2",
  } as const;

  return (
    <Layout pageTitle="Dashboard">
      {/* Welcome Banner */}
      <div
        data-ocid="dashboard.welcome_card"
        className="mb-6 rounded-xl bg-primary px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <p className="text-primary-foreground/70 text-sm mb-1">{today}</p>
          <h2 className="font-display text-xl font-bold text-primary-foreground truncate">
            Welcome back, {displayName}!
          </h2>
          {profile && (
            <p className="text-xs text-primary-foreground/60 mt-1">
              {profile.rollNumber} &middot; {profile.course} &middot; Year{" "}
              {String(profile.year)}, Sem {String(profile.semester)}
            </p>
          )}
        </div>
        <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/15 shrink-0">
          <User className="h-7 w-7 text-primary-foreground" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            data-ocid={`dashboard.stat.${stat.label.toLowerCase().replace(/ /g, "_")}`}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <stat.Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                {isLoading ? (
                  <Skeleton className="h-5 w-10 mb-1" />
                ) : (
                  <p className={`text-xl font-bold font-display ${stat.color}`}>
                    {stat.value}
                  </p>
                )}
                <p className="text-xs text-muted-foreground truncate">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Summary Card */}
      {profileLoading ? (
        <Card data-ocid="dashboard.profile_card.loading_state" className="mb-6">
          <CardContent className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton index
              <Skeleton key={i} className="h-8" />
            ))}
          </CardContent>
        </Card>
      ) : profile ? (
        <Card data-ocid="dashboard.profile_card" className="mb-6 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Student Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 text-sm">
              <div>
                <span className="text-muted-foreground text-xs">Name</span>
                <p className="font-medium text-foreground">{profile.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">
                  Roll Number
                </span>
                <p className="font-medium text-foreground">
                  {profile.rollNumber}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Course</span>
                <p className="font-medium text-foreground">{profile.course}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Year</span>
                <p className="font-medium text-foreground">
                  Year {String(profile.year)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Semester</span>
                <p className="font-medium text-foreground">
                  Semester {String(profile.semester)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Email</span>
                <p className="font-medium text-foreground truncate">
                  {profile.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Quick Access Tiles */}
      <div className="mb-6">
        <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick Access
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-ocid={`dashboard.${item.label.toLowerCase().replace(/ /g, "_")}.card`}
              className="block no-underline"
            >
              <Card className="h-full hover:shadow-md transition-smooth border-border cursor-pointer group">
                <CardHeader className="pb-2">
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center mb-2 ${item.color}`}
                  >
                    <item.Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold group-hover:text-primary transition-colors">
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-2">
                    {item.description}
                  </p>
                  {item.count !== null &&
                    (isLoading ? (
                      <Skeleton className="h-5 w-16" />
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {item.count}
                      </Badge>
                    ))}
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Recent Activity
        </h3>
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div
                data-ocid="dashboard.activity_list.loading_state"
                className="p-4 space-y-3"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton index
                  <Skeleton key={i} className="h-8" />
                ))}
              </div>
            ) : activityFeed.length === 0 ? (
              <div
                data-ocid="dashboard.activity_list.empty_state"
                className="flex flex-col items-center justify-center py-10 gap-2"
              >
                <Clock className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No recent activity yet.
                </p>
              </div>
            ) : (
              <ul data-ocid="dashboard.activity_list">
                {activityFeed.map((activity, idx) => (
                  <li
                    key={`${activity.type}-${idx}`}
                    data-ocid={`dashboard.activity.item.${idx + 1}`}
                    className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <div
                      className={`h-2 w-2 rounded-full shrink-0 ${activityTypeColor[activity.type]}`}
                    />
                    <span className="flex-1 text-sm text-foreground min-w-0 truncate">
                      {activity.text}
                    </span>
                    <Badge
                      variant="outline"
                      className="shrink-0 text-xs capitalize"
                    >
                      {activity.type}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetInternships,
  useGetJobs,
  useGetNotes,
  useIsAdmin,
} from "@/hooks/useQueries";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Lock,
  ShieldCheck,
} from "lucide-react";

const adminSections = [
  {
    label: "Notes",
    href: "/admin/notes",
    icon: BookOpen,
    description: "Manage study materials",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Placements",
    href: "/admin/placements",
    icon: Briefcase,
    description: "Manage job listings",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    label: "Internships",
    href: "/admin/internships",
    icon: GraduationCap,
    description: "Manage internship opportunities",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
];

function StatCard({
  label,
  count,
  icon: Icon,
  description,
  href,
  color,
  bg,
  loading,
}: {
  label: string;
  count: number;
  icon: React.ElementType;
  description: string;
  href: string;
  color: string;
  bg: string;
  loading: boolean;
}) {
  return (
    <a
      href={href}
      className="block no-underline group"
      data-ocid={`admin.${label.toLowerCase()}.card`}
    >
      <Card className="h-full hover:shadow-md transition-smooth cursor-pointer border-border">
        <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
          <div
            className={`h-10 w-10 rounded-lg flex items-center justify-center ${bg}`}
          >
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          {loading ? (
            <Skeleton className="h-7 w-10 rounded" />
          ) : (
            <span className="text-2xl font-bold font-display text-foreground">
              {count}
            </span>
          )}
        </CardHeader>
        <CardContent>
          <CardTitle className="text-sm font-semibold group-hover:text-primary transition-colors mb-1">
            {label}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </a>
  );
}

export default function AdminOverview() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: notes, isLoading: notesLoading } = useGetNotes();
  const { data: jobs, isLoading: jobsLoading } = useGetJobs();
  const { data: internships, isLoading: internshipsLoading } =
    useGetInternships();

  if (!adminLoading && !isAdmin) {
    return (
      <Layout pageTitle="Admin" isAdmin={false}>
        <div
          data-ocid="admin.access_denied"
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Access Denied
          </h2>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            You don't have administrator privileges to access this section.
          </p>
          <Badge variant="destructive">Not an Admin</Badge>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Admin Panel" isAdmin={true}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Admin Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage portal content from here
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {adminSections.map((sec, i) => (
            <StatCard
              key={sec.label}
              label={sec.label}
              description={sec.description}
              href={sec.href}
              icon={sec.icon}
              color={sec.color}
              bg={sec.bg}
              count={
                i === 0
                  ? (notes?.length ?? 0)
                  : i === 1
                    ? (jobs?.length ?? 0)
                    : (internships?.length ?? 0)
              }
              loading={
                i === 0
                  ? notesLoading
                  : i === 1
                    ? jobsLoading
                    : internshipsLoading
              }
            />
          ))}
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul>
              {[
                {
                  label: "Add a new study note",
                  href: "/admin/notes",
                  icon: BookOpen,
                },
                {
                  label: "Post a job listing",
                  href: "/admin/placements",
                  icon: Briefcase,
                },
                {
                  label: "Add an internship",
                  href: "/admin/internships",
                  icon: GraduationCap,
                },
              ].map((action) => (
                <li key={action.href}>
                  <a
                    href={action.href}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors border-b border-border last:border-0 group"
                    data-ocid={`admin.quick.${action.label.split(" ")[1]}.link`}
                  >
                    <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {action.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

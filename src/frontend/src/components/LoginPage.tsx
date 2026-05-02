import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Fingerprint, GraduationCap } from "lucide-react";

export function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/portal-logo.dim_120x120.png"
            alt="Student Portal"
            className="h-10 w-10 rounded-lg object-contain bg-primary-foreground/10 p-1"
          />
          <div>
            <div className="font-display font-bold text-primary-foreground text-lg leading-tight">
              Student Portal
            </div>
            <div className="text-xs text-primary-foreground/60">
              Academic Hub
            </div>
          </div>
        </div>

        <div>
          <img
            src="/assets/generated/login-hero.dim_600x400.png"
            alt="Academic portal illustration"
            className="w-full rounded-2xl object-cover shadow-2xl mb-10"
          />
          <blockquote className="text-primary-foreground/80 text-sm italic">
            \u201cOne platform for everything you need — notes, placements,
            internships, and your academic journey.\u201d
          </blockquote>
        </div>

        <p className="text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} Student Portal. Secure access via
          Internet Identity.
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-bold text-foreground text-xl">
              Student Portal
            </div>
            <div className="text-xs text-muted-foreground">Academic Hub</div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in with your Internet Identity to access your student portal.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              data-ocid="login.ii_button"
              onClick={() => login()}
              disabled={isLoading}
              className="w-full gap-3 bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-5"
              size="lg"
            >
              <Fingerprint className="h-5 w-5" />
              {isLoading
                ? "Connecting\u2026"
                : "Sign in with Internet Identity"}
            </Button>

            <p className="text-center text-xs text-muted-foreground px-4">
              Internet Identity provides secure, private authentication without
              passwords or personal data sharing.
            </p>
          </div>

          <div className="mt-12 rounded-xl border border-border bg-muted/40 p-5">
            <h3 className="font-display text-sm font-semibold text-foreground mb-3">
              What\u2019s inside
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "\uD83D\uDCDA Study notes by subject",
                "\uD83D\uDCBC Placement job listings",
                "\uD83C\uDF93 Internship opportunities",
                "\uD83D\uDC64 Your academic profile",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Built with caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

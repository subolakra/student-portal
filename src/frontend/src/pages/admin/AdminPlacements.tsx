import { createActor } from "@/backend";
import { Layout } from "@/components/Layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddJob,
  useDeleteJob,
  useGetJobs,
  useIsAdmin,
} from "@/hooks/useQueries";
import type { Job } from "@/types/index";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Briefcase, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface JobForm {
  company: string;
  role: string;
  eligibility: string;
  deadline: string;
  description: string;
  pdfKey: string;
  isActive: boolean;
}

function AccessDenied() {
  return (
    <Layout pageTitle="Admin — Placements">
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
        <p className="text-sm text-muted-foreground">
          You don't have administrator privileges.
        </p>
      </div>
    </Layout>
  );
}

function JobFormDialog({
  open,
  onClose,
  editJob,
}: {
  open: boolean;
  onClose: () => void;
  editJob: Job | null;
}) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const addJob = useAddJob();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobForm>({
    defaultValues: editJob
      ? {
          company: editJob.company,
          role: editJob.role,
          eligibility: editJob.eligibility,
          deadline: editJob.deadline,
          description: editJob.description,
          pdfKey: editJob.pdfKey,
          isActive: editJob.isActive,
        }
      : {
          company: "",
          role: "",
          eligibility: "",
          deadline: "",
          description: "",
          pdfKey: "",
          isActive: true,
        },
  });

  const isActiveVal = watch("isActive");

  const onSubmit = async (data: JobForm) => {
    try {
      if (editJob && actor) {
        const { isActive: _ia, ...rest } = data;
        const ok = await actor.updateJob(editJob.id, rest);
        if (!ok) throw new Error("Update failed");
        await queryClient.invalidateQueries({ queryKey: ["jobs"] });
        toast.success("Job updated successfully");
      } else {
        const { isActive: _ia, ...rest } = data;
        await addJob.mutateAsync(rest);
        toast.success("Job posted successfully");
      }
      reset();
      onClose();
    } catch {
      toast.error(editJob ? "Failed to update job" : "Failed to post job");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-lg" data-ocid="admin.job.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editJob ? "Edit Job Listing" : "Post New Job"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="job-company">Company</Label>
              <Input
                id="job-company"
                data-ocid="admin.job.company.input"
                placeholder="e.g. Google"
                {...register("company", { required: "Company is required" })}
              />
              {errors.company && (
                <p className="text-xs text-destructive">
                  {errors.company.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job-role">Role</Label>
              <Input
                id="job-role"
                data-ocid="admin.job.role.input"
                placeholder="e.g. SDE Intern"
                {...register("role", { required: "Role is required" })}
              />
              {errors.role && (
                <p className="text-xs text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="job-eligibility">Eligibility</Label>
            <Input
              id="job-eligibility"
              data-ocid="admin.job.eligibility.input"
              placeholder="e.g. B.Tech CSE / IT, 7.0+ CGPA"
              {...register("eligibility", {
                required: "Eligibility is required",
              })}
            />
            {errors.eligibility && (
              <p className="text-xs text-destructive">
                {errors.eligibility.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="job-deadline">Deadline</Label>
              <Input
                id="job-deadline"
                type="date"
                data-ocid="admin.job.deadline.input"
                {...register("deadline", { required: "Deadline is required" })}
              />
              {errors.deadline && (
                <p className="text-xs text-destructive">
                  {errors.deadline.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job-pdfkey">PDF Key</Label>
              <Input
                id="job-pdfkey"
                data-ocid="admin.job.pdfkey.input"
                placeholder="storage-blob-key"
                {...register("pdfKey")}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="job-desc">Description</Label>
            <Textarea
              id="job-desc"
              data-ocid="admin.job.description.textarea"
              placeholder="Job description, package, responsibilities…"
              rows={3}
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="job-active"
              checked={isActiveVal}
              onCheckedChange={(v) => setValue("isActive", v)}
              data-ocid="admin.job.active.switch"
            />
            <Label htmlFor="job-active" className="cursor-pointer">
              Active (visible to students)
            </Label>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
              data-ocid="admin.job.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-ocid="admin.job.submit_button"
            >
              {isSubmitting ? "Saving…" : editJob ? "Update Job" : "Post Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPlacements() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: jobs, isLoading } = useGetJobs();
  const deleteJob = useDeleteJob();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);

  if (!adminLoading && !isAdmin) return <AccessDenied />;

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteJob.mutateAsync(deleteTarget);
      toast.success("Job listing deleted");
    } catch {
      toast.error("Failed to delete job");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <Layout pageTitle="Admin — Placements" isAdmin={true}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Job Listings
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage placement drives and job opportunities
            </p>
          </div>
          <Button
            onClick={() => {
              setEditJob(null);
              setDialogOpen(true);
            }}
            data-ocid="admin.placements.add_button"
          >
            <Plus className="h-4 w-4 mr-2" /> Post Job
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2" data-ocid="admin.placements.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : !jobs?.length ? (
          <Card>
            <CardContent
              className="flex flex-col items-center justify-center py-16 gap-3"
              data-ocid="admin.placements.empty_state"
            >
              <Briefcase className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No job listings yet. Post the first one.
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setEditJob(null);
                  setDialogOpen(true);
                }}
                data-ocid="admin.placements.empty.add_button"
              >
                <Plus className="h-4 w-4 mr-1" /> Post Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <ul data-ocid="admin.placements.list">
                {jobs.map((job, idx) => (
                  <li
                    key={job.id.toString()}
                    data-ocid={`admin.placements.item.${idx + 1}`}
                    className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                      <Briefcase className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {job.company} — {job.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Deadline: {job.deadline}
                      </p>
                    </div>
                    <Badge
                      variant={job.isActive ? "default" : "secondary"}
                      className="hidden sm:inline-flex text-xs"
                    >
                      {job.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditJob(job);
                          setDialogOpen(true);
                        }}
                        data-ocid={`admin.placements.edit_button.${idx + 1}`}
                        aria-label="Edit job"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(job.id)}
                        data-ocid={`admin.placements.delete_button.${idx + 1}`}
                        aria-label="Delete job"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <JobFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editJob={editJob}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(v) => {
          if (!v) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent data-ocid="admin.placements.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the job listing. Students will no
              longer see it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.placements.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="admin.placements.delete.confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}

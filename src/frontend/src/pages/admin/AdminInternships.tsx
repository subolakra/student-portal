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
  useAddInternship,
  useDeleteInternship,
  useGetInternships,
  useIsAdmin,
} from "@/hooks/useQueries";
import type { Internship } from "@/types/index";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { GraduationCap, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface InternshipForm {
  company: string;
  role: string;
  duration: string;
  stipend: string;
  requirements: string;
  deadline: string;
  description: string;
  pdfKey: string;
  applicationLink: string;
  isActive: boolean;
}

function AccessDenied() {
  return (
    <Layout pageTitle="Admin — Internships">
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

function InternshipFormDialog({
  open,
  onClose,
  editInternship,
}: {
  open: boolean;
  onClose: () => void;
  editInternship: Internship | null;
}) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const addInternship = useAddInternship();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InternshipForm>({
    defaultValues: editInternship
      ? {
          company: editInternship.company,
          role: editInternship.role,
          duration: editInternship.duration,
          stipend: editInternship.stipend,
          requirements: editInternship.requirements,
          deadline: editInternship.deadline,
          description: editInternship.description,
          pdfKey: editInternship.pdfKey,
          applicationLink: editInternship.applicationLink,
          isActive: editInternship.isActive,
        }
      : {
          company: "",
          role: "",
          duration: "",
          stipend: "",
          requirements: "",
          deadline: "",
          description: "",
          pdfKey: "",
          applicationLink: "",
          isActive: true,
        },
  });

  const isActiveVal = watch("isActive");

  const onSubmit = async (data: InternshipForm) => {
    try {
      const { isActive: _ia, ...rest } = data;
      if (editInternship && actor) {
        const ok = await actor.updateInternship(editInternship.id, rest);
        if (!ok) throw new Error("Update failed");
        await queryClient.invalidateQueries({ queryKey: ["internships"] });
        toast.success("Internship updated successfully");
      } else {
        await addInternship.mutateAsync(rest);
        toast.success("Internship added successfully");
      }
      reset();
      onClose();
    } catch {
      toast.error(
        editInternship
          ? "Failed to update internship"
          : "Failed to add internship",
      );
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
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="admin.internship.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            {editInternship ? "Edit Internship" : "Add Internship"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="int-company">Company</Label>
              <Input
                id="int-company"
                data-ocid="admin.internship.company.input"
                placeholder="e.g. Microsoft"
                {...register("company", { required: "Company is required" })}
              />
              {errors.company && (
                <p className="text-xs text-destructive">
                  {errors.company.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="int-role">Role</Label>
              <Input
                id="int-role"
                data-ocid="admin.internship.role.input"
                placeholder="e.g. Data Analyst"
                {...register("role", { required: "Role is required" })}
              />
              {errors.role && (
                <p className="text-xs text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="int-duration">Duration</Label>
              <Input
                id="int-duration"
                data-ocid="admin.internship.duration.input"
                placeholder="e.g. 2 months"
                {...register("duration", { required: "Duration is required" })}
              />
              {errors.duration && (
                <p className="text-xs text-destructive">
                  {errors.duration.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="int-stipend">Stipend</Label>
              <Input
                id="int-stipend"
                data-ocid="admin.internship.stipend.input"
                placeholder="e.g. ₹15,000/month"
                {...register("stipend", { required: "Stipend is required" })}
              />
              {errors.stipend && (
                <p className="text-xs text-destructive">
                  {errors.stipend.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="int-requirements">Requirements</Label>
            <Input
              id="int-requirements"
              data-ocid="admin.internship.requirements.input"
              placeholder="e.g. Python, ML basics, 2nd/3rd year"
              {...register("requirements", {
                required: "Requirements are required",
              })}
            />
            {errors.requirements && (
              <p className="text-xs text-destructive">
                {errors.requirements.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="int-deadline">Deadline</Label>
              <Input
                id="int-deadline"
                type="date"
                data-ocid="admin.internship.deadline.input"
                {...register("deadline", { required: "Deadline is required" })}
              />
              {errors.deadline && (
                <p className="text-xs text-destructive">
                  {errors.deadline.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="int-pdfkey">PDF Key</Label>
              <Input
                id="int-pdfkey"
                data-ocid="admin.internship.pdfkey.input"
                placeholder="storage-blob-key"
                {...register("pdfKey")}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="int-desc">Description</Label>
            <Textarea
              id="int-desc"
              data-ocid="admin.internship.description.textarea"
              placeholder="Internship overview, responsibilities, learning outcomes…"
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
          <div className="space-y-1.5">
            <Label htmlFor="int-link">Application Link</Label>
            <Input
              id="int-link"
              data-ocid="admin.internship.applicationlink.input"
              placeholder="https://careers.example.com/apply"
              {...register("applicationLink")}
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="int-active"
              checked={isActiveVal}
              onCheckedChange={(v) => setValue("isActive", v)}
              data-ocid="admin.internship.active.switch"
            />
            <Label htmlFor="int-active" className="cursor-pointer">
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
              data-ocid="admin.internship.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-ocid="admin.internship.submit_button"
            >
              {isSubmitting
                ? "Saving…"
                : editInternship
                  ? "Update Internship"
                  : "Add Internship"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminInternships() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: internships, isLoading } = useGetInternships();
  const deleteInternship = useDeleteInternship();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editInternship, setEditInternship] = useState<Internship | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);

  if (!adminLoading && !isAdmin) return <AccessDenied />;

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteInternship.mutateAsync(deleteTarget);
      toast.success("Internship deleted");
    } catch {
      toast.error("Failed to delete internship");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <Layout pageTitle="Admin — Internships" isAdmin={true}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Internship Listings
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage internship opportunities for students
            </p>
          </div>
          <Button
            onClick={() => {
              setEditInternship(null);
              setDialogOpen(true);
            }}
            data-ocid="admin.internships.add_button"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Internship
          </Button>
        </div>

        {isLoading ? (
          <div
            className="space-y-2"
            data-ocid="admin.internships.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : !internships?.length ? (
          <Card>
            <CardContent
              className="flex flex-col items-center justify-center py-16 gap-3"
              data-ocid="admin.internships.empty_state"
            >
              <GraduationCap className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No internships yet. Add the first listing.
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setEditInternship(null);
                  setDialogOpen(true);
                }}
                data-ocid="admin.internships.empty.add_button"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Internship
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <ul data-ocid="admin.internships.list">
                {internships.map((internship, idx) => (
                  <li
                    key={internship.id.toString()}
                    data-ocid={`admin.internships.item.${idx + 1}`}
                    className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-md bg-chart-2/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="h-4 w-4 text-chart-2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {internship.company} — {internship.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {internship.duration} · {internship.stipend} · Deadline:{" "}
                        {internship.deadline}
                      </p>
                    </div>
                    <Badge
                      variant={internship.isActive ? "default" : "secondary"}
                      className="hidden sm:inline-flex text-xs"
                    >
                      {internship.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditInternship(internship);
                          setDialogOpen(true);
                        }}
                        data-ocid={`admin.internships.edit_button.${idx + 1}`}
                        aria-label="Edit internship"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(internship.id)}
                        data-ocid={`admin.internships.delete_button.${idx + 1}`}
                        aria-label="Delete internship"
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

      <InternshipFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editInternship={editInternship}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(v) => {
          if (!v) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent data-ocid="admin.internships.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Internship?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the internship listing. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.internships.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="admin.internships.delete.confirm_button"
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

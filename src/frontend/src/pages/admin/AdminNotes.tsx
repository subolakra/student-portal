import { FileType } from "@/backend";
import { createActor } from "@/backend";
import type { Note } from "@/backend.d";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddNote,
  useDeleteNote,
  useGetNotes,
  useIsAdmin,
} from "@/hooks/useQueries";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, FileText, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface NoteForm {
  title: string;
  subject: string;
  description: string;
  fileType: "pdf" | "text";
  fileKey: string;
}

function AccessDenied() {
  return (
    <Layout pageTitle="Admin — Notes">
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

function NoteFormDialog({
  open,
  onClose,
  editNote,
}: {
  open: boolean;
  onClose: () => void;
  editNote: Note | null;
}) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const addNote = useAddNote();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteForm>({
    defaultValues: editNote
      ? {
          title: editNote.title,
          subject: editNote.subject,
          description: editNote.description,
          fileType: editNote.fileType === "pdf" ? "pdf" : "text",
          fileKey: editNote.fileKey,
        }
      : {
          title: "",
          subject: "",
          description: "",
          fileType: "pdf",
          fileKey: "",
        },
  });

  const fileTypeVal = watch("fileType");

  const onSubmit = async (data: NoteForm) => {
    try {
      const ft: FileType =
        data.fileType === "pdf" ? FileType.pdf : FileType.text;
      if (editNote && actor) {
        const ok = await actor.updateNote(editNote.id, {
          ...data,
          fileType: ft,
        });
        if (!ok) throw new Error("Update failed");
        await queryClient.invalidateQueries({ queryKey: ["notes"] });
        toast.success("Note updated successfully");
      } else {
        await addNote.mutateAsync({ ...data, fileType: ft });
        toast.success("Note added successfully");
      }
      reset();
      onClose();
    } catch {
      toast.error(editNote ? "Failed to update note" : "Failed to add note");
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
      <DialogContent className="max-w-md" data-ocid="admin.note.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editNote ? "Edit Note" : "Add New Note"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              data-ocid="admin.note.title.input"
              placeholder="e.g. Data Structures — Graphs"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note-subject">Subject</Label>
            <Input
              id="note-subject"
              data-ocid="admin.note.subject.input"
              placeholder="e.g. Computer Science"
              {...register("subject", { required: "Subject is required" })}
            />
            {errors.subject && (
              <p className="text-xs text-destructive">
                {errors.subject.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note-desc">Description</Label>
            <Textarea
              id="note-desc"
              data-ocid="admin.note.description.textarea"
              placeholder="Brief description of the note content"
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
            <Label>File Type</Label>
            <Select
              value={fileTypeVal}
              onValueChange={(v) => setValue("fileType", v as "pdf" | "text")}
            >
              <SelectTrigger data-ocid="admin.note.filetype.select">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note-filekey">File Key (Storage Key)</Label>
            <Input
              id="note-filekey"
              data-ocid="admin.note.filekey.input"
              placeholder="object-storage-blob-key"
              {...register("fileKey", { required: "File key is required" })}
            />
            {errors.fileKey && (
              <p className="text-xs text-destructive">
                {errors.fileKey.message}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
              data-ocid="admin.note.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-ocid="admin.note.submit_button"
            >
              {isSubmitting ? "Saving…" : editNote ? "Update Note" : "Add Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminNotes() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: notes, isLoading } = useGetNotes();
  const deleteNote = useDeleteNote();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);

  if (!adminLoading && !isAdmin) return <AccessDenied />;

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteNote.mutateAsync(deleteTarget);
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <Layout pageTitle="Admin — Notes" isAdmin={true}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Study Notes
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage uploaded notes and study materials
            </p>
          </div>
          <Button
            onClick={() => {
              setEditNote(null);
              setDialogOpen(true);
            }}
            data-ocid="admin.notes.add_button"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Note
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2" data-ocid="admin.notes.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : !notes?.length ? (
          <Card>
            <CardContent
              className="flex flex-col items-center justify-center py-16 gap-3"
              data-ocid="admin.notes.empty_state"
            >
              <BookOpen className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No notes yet. Add your first study note.
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setEditNote(null);
                  setDialogOpen(true);
                }}
                data-ocid="admin.notes.empty.add_button"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Note
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <ul data-ocid="admin.notes.list">
                {notes.map((note, idx) => (
                  <li
                    key={note.id.toString()}
                    data-ocid={`admin.notes.item.${idx + 1}`}
                    className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {note.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {note.subject}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="hidden sm:inline-flex text-xs"
                    >
                      {note.fileType === "pdf" ? "PDF" : "Text"}
                    </Badge>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditNote(note);
                          setDialogOpen(true);
                        }}
                        data-ocid={`admin.notes.edit_button.${idx + 1}`}
                        aria-label="Edit note"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(note.id)}
                        data-ocid={`admin.notes.delete_button.${idx + 1}`}
                        aria-label="Delete note"
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

      <NoteFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editNote={editNote}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(v) => {
          if (!v) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent data-ocid="admin.notes.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the note. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.notes.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="admin.notes.delete.confirm_button"
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

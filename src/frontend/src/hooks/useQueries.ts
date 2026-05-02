import { createActor } from "@/backend";
import { FileType } from "@/backend";
import type { Internship, Job, Note, Profile } from "@/backend.d";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export { FileType };

export function useNotes() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export const useGetNotes = useNotes;

export function useNoteById(id: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Note | null>({
    queryKey: ["notes", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNoteById(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useJobs() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJobs();
    },
    enabled: !!actor && !isFetching,
  });
}

export const useGetJobs = useJobs;

export function useJobById(id: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Job | null>({
    queryKey: ["jobs", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getJobById(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export const useGetJobById = useJobById;

export function useInternships() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Internship[]>({
    queryKey: ["internships"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInternships();
    },
    enabled: !!actor && !isFetching,
  });
}

export const useGetInternships = useInternships;

export function useInternshipById(id: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Internship | null>({
    queryKey: ["internships", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getInternshipById(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export const useGetInternshipById = useInternshipById;

export function useMyProfile() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export const useGetMyProfile = useMyProfile;

export function useIsAdmin() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddNote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      title: string;
      subject: string;
      description: string;
      fileType: FileType;
      fileKey: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addNote(input);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useAddJob() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      role: string;
      description: string;
      deadline: string;
      eligibility: string;
      company: string;
      pdfKey: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addJob(input);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useAddInternship() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      duration: string;
      role: string;
      description: string;
      deadline: string;
      company: string;
      pdfKey: string;
      requirements: string;
      stipend: string;
      applicationLink: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addInternship(input);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["internships"] }),
  });
}

export function useDeleteNote() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteNote(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useDeleteJob() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteJob(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useDeleteInternship() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteInternship(id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["internships"] }),
  });
}

export function useUpdateMyProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      semester: bigint;
      name: string;
      year: bigint;
      email: string;
      rollNumber: string;
      phone: string;
      course: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateMyProfile(input);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}

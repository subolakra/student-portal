import List "mo:core/List";
import ProfileApi "mixins/profile-api";
import NotesApi "mixins/notes-api";
import PlacementApi "mixins/placement-api";
import AdminApi "mixins/admin-api";
import NotesLib "lib/notes";
import PlacementLib "lib/placement";
import ProfileTypes "types/profile";
import NoteTypes "types/notes";
import PlacementTypes "types/placement";

actor {
  // --- Stable state ---
  let profiles = List.empty<ProfileTypes.Profile>();
  let notes = List.empty<NoteTypes.Note>();
  let nextNoteId = { var value : Nat = 0 };
  let jobs = List.empty<PlacementTypes.Job>();
  let nextJobId = { var value : Nat = 0 };
  let internships = List.empty<PlacementTypes.Internship>();
  let nextInternshipId = { var value : Nat = 0 };

  // --- Seed sample data ---
  NotesLib.seedNotes(notes, nextNoteId);
  PlacementLib.seedJobs(jobs, nextJobId);
  PlacementLib.seedInternships(internships, nextInternshipId);

  // --- Mixins ---
  include AdminApi();
  include ProfileApi(profiles);
  include NotesApi(notes, nextNoteId);
  include PlacementApi(jobs, nextJobId, internships, nextInternshipId);
};

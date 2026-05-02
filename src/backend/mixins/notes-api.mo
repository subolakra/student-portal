import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import NotesLib "../lib/notes";
import NoteTypes "../types/notes";
import CommonTypes "../types/common";

mixin (
  notes : List.List<NoteTypes.Note>,
  nextNoteId : { var value : Nat },
) {
  public shared query func getNotes() : async [NoteTypes.Note] {
    NotesLib.getNotes(notes);
  };

  public shared query func getNoteById(id : CommonTypes.NoteId) : async ?NoteTypes.Note {
    NotesLib.getNoteById(notes, id);
  };

  public shared ({ caller }) func addNote(input : {
    title : Text;
    subject : Text;
    description : Text;
    fileType : NoteTypes.FileType;
    fileKey : Text;
  }) : async Nat {
    if (caller.isAnonymous()) Runtime.trap("Not authorized");
    NotesLib.addNote(notes, input, caller, nextNoteId);
  };

  public shared ({ caller }) func updateNote(
    id : CommonTypes.NoteId,
    input : {
      title : Text;
      subject : Text;
      description : Text;
      fileType : NoteTypes.FileType;
      fileKey : Text;
    },
  ) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Not authorized");
    NotesLib.updateNote(notes, id, input);
  };

  public shared ({ caller }) func deleteNote(id : CommonTypes.NoteId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Not authorized");
    NotesLib.deleteNote(notes, id);
  };
};

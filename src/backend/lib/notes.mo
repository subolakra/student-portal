import List "mo:core/List";
import Principal "mo:core/Principal";
import NoteTypes "../types/notes";
import CommonTypes "../types/common";

module {
  public type Note = NoteTypes.Note;
  public type FileType = NoteTypes.FileType;

  public type NoteInput = {
    title : Text;
    subject : Text;
    description : Text;
    fileType : FileType;
    fileKey : Text;
  };

  func makeNote(id : Nat, input : NoteInput, uploadedBy : Principal, ts : CommonTypes.Timestamp) : Note {
    {
      id;
      title = input.title;
      subject = input.subject;
      description = input.description;
      fileType = input.fileType;
      fileKey = input.fileKey;
      uploadDate = ts;
      uploadedBy;
    };
  };

  public func seedNotes(notes : List.List<Note>, nextId : { var value : Nat }) {
    let admin = Principal.fromText("2vxsx-fae");
    let seeds : [(Text, Text, Text, FileType, Text)] = [
      ("Data Structures Notes", "Computer Science", "Comprehensive notes on arrays, linked lists, trees, graphs and dynamic programming.", #pdf, "notes/ds-notes.pdf"),
      ("DBMS Unit 2", "Computer Science", "Database management systems: ER diagrams, normalization, SQL queries and transactions.", #pdf, "notes/dbms-unit2.pdf"),
      ("Circuit Theory", "Electronics", "Fundamentals of circuit analysis, Kirchhoff laws, AC/DC circuits and network theorems.", #pdf, "notes/circuit-theory.pdf"),
      ("Differential Equations", "Mathematics", "Ordinary and partial differential equations with solved examples and applications.", #pdf, "notes/diff-eq.pdf"),
      ("Operating Systems Concepts", "Computer Science", "Process management, memory management, file systems, deadlocks and scheduling algorithms.", #pdf, "notes/os-concepts.pdf"),
    ];
    for ((title, subject, desc, ft, key) in seeds.values()) {
      let id = nextId.value;
      nextId.value += 1;
      notes.add(makeNote(id, { title; subject; description = desc; fileType = ft; fileKey = key }, admin, 1700000000000000000));
    };
  };

  public func addNote(
    notes : List.List<Note>,
    input : NoteInput,
    uploadedBy : Principal,
    nextId : { var value : Nat },
  ) : Nat {
    let id = nextId.value;
    nextId.value += 1;
    notes.add(makeNote(id, input, uploadedBy, 0));
    id;
  };

  public func updateNote(
    notes : List.List<Note>,
    id : CommonTypes.NoteId,
    input : NoteInput,
  ) : Bool {
    switch (notes.findIndex(func(n : Note) : Bool { n.id == id })) {
      case (?idx) {
        let existing = notes.at(idx);
        notes.put(idx, { existing with
          title = input.title;
          subject = input.subject;
          description = input.description;
          fileType = input.fileType;
          fileKey = input.fileKey;
        });
        true;
      };
      case null false;
    };
  };

  public func deleteNote(
    notes : List.List<Note>,
    id : CommonTypes.NoteId,
  ) : Bool {
    let before = notes.size();
    let filtered = notes.filter(func(n : Note) : Bool { n.id != id });
    notes.clear();
    notes.append(filtered);
    notes.size() < before;
  };

  public func getNotes(notes : List.List<Note>) : [Note] {
    notes.toArray();
  };

  public func getNoteById(
    notes : List.List<Note>,
    id : CommonTypes.NoteId,
  ) : ?Note {
    notes.find(func(n : Note) : Bool { n.id == id });
  };
};

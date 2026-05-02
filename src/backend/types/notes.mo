import CommonTypes "common";

module {
  public type FileType = { #pdf; #text };

  public type Note = {
    id : CommonTypes.NoteId;
    title : Text;
    subject : Text;
    description : Text;
    fileType : FileType;
    fileKey : Text;
    uploadDate : CommonTypes.Timestamp;
    uploadedBy : Principal;
  };
};

import CommonTypes "common";

module {
  public type Job = {
    id : CommonTypes.JobId;
    company : Text;
    role : Text;
    eligibility : Text;
    deadline : Text;
    description : Text;
    pdfKey : Text;
    postedDate : CommonTypes.Timestamp;
    isActive : Bool;
  };

  public type Internship = {
    id : CommonTypes.InternshipId;
    company : Text;
    role : Text;
    duration : Text;
    stipend : Text;
    requirements : Text;
    deadline : Text;
    description : Text;
    pdfKey : Text;
    applicationLink : Text;
    postedDate : CommonTypes.Timestamp;
    isActive : Bool;
  };
};

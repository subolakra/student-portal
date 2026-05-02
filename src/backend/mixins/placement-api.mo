import List "mo:core/List";
import Runtime "mo:core/Runtime";
import PlacementLib "../lib/placement";
import PlacementTypes "../types/placement";
import CommonTypes "../types/common";

mixin (
  jobs : List.List<PlacementTypes.Job>,
  nextJobId : { var value : Nat },
  internships : List.List<PlacementTypes.Internship>,
  nextInternshipId : { var value : Nat },
) {
  // --- Jobs ---
  public shared query func getJobs() : async [PlacementTypes.Job] {
    PlacementLib.getJobs(jobs);
  };

  public shared query func getJobById(id : CommonTypes.JobId) : async ?PlacementTypes.Job {
    PlacementLib.getJobById(jobs, id);
  };

  public shared ({ caller }) func addJob(input : {
    company : Text;
    role : Text;
    eligibility : Text;
    deadline : Text;
    description : Text;
    pdfKey : Text;
  }) : async Nat {
    if (caller.isAnonymous()) Runtime.trap("Not authorized");
    PlacementLib.addJob(jobs, input, nextJobId);
  };

  public shared ({ caller }) func updateJob(
    id : CommonTypes.JobId,
    input : {
      company : Text;
      role : Text;
      eligibility : Text;
      deadline : Text;
      description : Text;
      pdfKey : Text;
    },
  ) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Not authorized");
    PlacementLib.updateJob(jobs, id, input);
  };

  public shared ({ caller }) func deleteJob(id : CommonTypes.JobId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Not authorized");
    PlacementLib.deleteJob(jobs, id);
  };

  // --- Internships ---
  public shared query func getInternships() : async [PlacementTypes.Internship] {
    PlacementLib.getInternships(internships);
  };

  public shared query func getInternshipById(id : CommonTypes.InternshipId) : async ?PlacementTypes.Internship {
    PlacementLib.getInternshipById(internships, id);
  };

  public shared ({ caller }) func addInternship(input : {
    company : Text;
    role : Text;
    duration : Text;
    stipend : Text;
    requirements : Text;
    deadline : Text;
    description : Text;
    pdfKey : Text;
    applicationLink : Text;
  }) : async Nat {
    if (caller.isAnonymous()) Runtime.trap("Not authorized");
    PlacementLib.addInternship(internships, input, nextInternshipId);
  };

  public shared ({ caller }) func updateInternship(
    id : CommonTypes.InternshipId,
    input : {
      company : Text;
      role : Text;
      duration : Text;
      stipend : Text;
      requirements : Text;
      deadline : Text;
      description : Text;
      pdfKey : Text;
      applicationLink : Text;
    },
  ) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Not authorized");
    PlacementLib.updateInternship(internships, id, input);
  };

  public shared ({ caller }) func deleteInternship(id : CommonTypes.InternshipId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Not authorized");
    PlacementLib.deleteInternship(internships, id);
  };
};

import List "mo:core/List";
import PlacementTypes "../types/placement";
import CommonTypes "../types/common";

module {
  public type Job = PlacementTypes.Job;
  public type Internship = PlacementTypes.Internship;

  public type JobInput = {
    company : Text;
    role : Text;
    eligibility : Text;
    deadline : Text;
    description : Text;
    pdfKey : Text;
  };

  public type InternshipInput = {
    company : Text;
    role : Text;
    duration : Text;
    stipend : Text;
    requirements : Text;
    deadline : Text;
    description : Text;
    pdfKey : Text;
    applicationLink : Text;
  };

  // ---- Jobs ----

  public func seedJobs(jobs : List.List<Job>, nextId : { var value : Nat }) {
    let seeds : [(Text, Text, Text, Text, Text, Text)] = [
      ("Google", "Software Engineer", "B.Tech CS/IT with 7.5+ CGPA", "2024-03-15", "Join Google's core engineering team working on large-scale distributed systems and cutting-edge products.", "placements/google-swe.pdf"),
      ("Amazon", "SDE-1", "B.Tech any branch with 7.0+ CGPA", "2024-03-20", "Amazon SDE role focused on building scalable backend services and customer-facing features across AWS and Amazon retail.", "placements/amazon-sde.pdf"),
      ("Microsoft", "Business Analyst", "B.Tech/MBA with strong analytical skills", "2024-03-25", "Drive business insights and product decisions using data analysis and cross-functional collaboration at Microsoft.", "placements/microsoft-analyst.pdf"),
      ("Infosys", "Systems Engineer", "B.Tech any branch with 6.5+ CGPA", "2024-04-01", "Systems Engineer role at Infosys covering full-stack development, client projects and enterprise solutions.", "placements/infosys-se.pdf"),
      ("Wipro", "Project Engineer Associate", "B.Tech any branch with 6.0+ CGPA", "2024-04-10", "Entry-level engineering role at Wipro focusing on software development, testing and delivery for global clients.", "placements/wipro-associate.pdf"),
    ];
    for ((company, role, eligibility, deadline, description, pdfKey) in seeds.values()) {
      let id = nextId.value;
      nextId.value += 1;
      jobs.add({
        id; company; role; eligibility; deadline; description; pdfKey;
        postedDate = 1700000000000000000;
        isActive = true;
      });
    };
  };

  public func addJob(
    jobs : List.List<Job>,
    input : JobInput,
    nextId : { var value : Nat },
  ) : Nat {
    let id = nextId.value;
    nextId.value += 1;
    jobs.add({
      id;
      company = input.company;
      role = input.role;
      eligibility = input.eligibility;
      deadline = input.deadline;
      description = input.description;
      pdfKey = input.pdfKey;
      postedDate = 0;
      isActive = true;
    });
    id;
  };

  public func updateJob(
    jobs : List.List<Job>,
    id : CommonTypes.JobId,
    input : JobInput,
  ) : Bool {
    switch (jobs.findIndex(func(j : Job) : Bool { j.id == id })) {
      case (?idx) {
        let existing = jobs.at(idx);
        jobs.put(idx, { existing with
          company = input.company;
          role = input.role;
          eligibility = input.eligibility;
          deadline = input.deadline;
          description = input.description;
          pdfKey = input.pdfKey;
        });
        true;
      };
      case null false;
    };
  };

  public func deleteJob(
    jobs : List.List<Job>,
    id : CommonTypes.JobId,
  ) : Bool {
    let before = jobs.size();
    let filtered = jobs.filter(func(j : Job) : Bool { j.id != id });
    jobs.clear();
    jobs.append(filtered);
    jobs.size() < before;
  };

  public func getJobs(jobs : List.List<Job>) : [Job] {
    jobs.toArray();
  };

  public func getJobById(
    jobs : List.List<Job>,
    id : CommonTypes.JobId,
  ) : ?Job {
    jobs.find(func(j : Job) : Bool { j.id == id });
  };

  // ---- Internships ----

  public func seedInternships(internships : List.List<Internship>, nextId : { var value : Nat }) {
    let seeds : [(Text, Text, Text, Text, Text, Text, Text, Text, Text)] = [
      ("Google", "Software Engineering Intern", "2 months", "₹80,000/month", "Strong DSA, proficiency in at least one language (Java/Python/C++)", "2024-02-28", "Work on real Google products alongside senior engineers in a fast-paced, innovative environment.", "internships/google-intern.pdf", "https://careers.google.com/students/"),
      ("Microsoft", "Software Development Intern", "2 months", "₹75,000/month", "B.Tech CS/IT, knowledge of OOP and cloud basics", "2024-03-05", "Intern at Microsoft working on Azure cloud services or Windows/Office product teams.", "internships/microsoft-intern.pdf", "https://careers.microsoft.com/students/"),
      ("Flipkart", "Product Management Intern", "3 months", "₹50,000/month", "Strong analytical skills, interest in e-commerce and product strategy", "2024-03-10", "Join Flipkart's PM team to drive product roadmap decisions and work cross-functionally with design and engineering.", "internships/flipkart-pm-intern.pdf", "https://careers.flipkart.com/intern"),
      ("Deloitte", "Technology Consulting Intern", "2 months", "₹35,000/month", "B.Tech any branch, good communication skills", "2024-03-18", "Technology consulting internship at Deloitte covering digital transformation, ERP systems and IT strategy.", "internships/deloitte-tech-intern.pdf", "https://careers.deloitte.com/internships"),
      ("DRDO", "Research Intern", "6 months", "₹15,000/month", "B.Tech/M.Tech in ECE/CS/ME with strong research aptitude", "2024-04-05", "Research internship at DRDO labs contributing to defence technology projects in electronics, software or mechanical domains.", "internships/drdo-research-intern.pdf", "https://www.drdo.gov.in/internship"),
    ];
    for ((company, role, duration, stipend, requirements, deadline, description, pdfKey, applicationLink) in seeds.values()) {
      let id = nextId.value;
      nextId.value += 1;
      internships.add({
        id; company; role; duration; stipend; requirements;
        deadline; description; pdfKey; applicationLink;
        postedDate = 1700000000000000000;
        isActive = true;
      });
    };
  };

  public func addInternship(
    internships : List.List<Internship>,
    input : InternshipInput,
    nextId : { var value : Nat },
  ) : Nat {
    let id = nextId.value;
    nextId.value += 1;
    internships.add({
      id;
      company = input.company;
      role = input.role;
      duration = input.duration;
      stipend = input.stipend;
      requirements = input.requirements;
      deadline = input.deadline;
      description = input.description;
      pdfKey = input.pdfKey;
      applicationLink = input.applicationLink;
      postedDate = 0;
      isActive = true;
    });
    id;
  };

  public func updateInternship(
    internships : List.List<Internship>,
    id : CommonTypes.InternshipId,
    input : InternshipInput,
  ) : Bool {
    switch (internships.findIndex(func(i : Internship) : Bool { i.id == id })) {
      case (?idx) {
        let existing = internships.at(idx);
        internships.put(idx, { existing with
          company = input.company;
          role = input.role;
          duration = input.duration;
          stipend = input.stipend;
          requirements = input.requirements;
          deadline = input.deadline;
          description = input.description;
          pdfKey = input.pdfKey;
          applicationLink = input.applicationLink;
        });
        true;
      };
      case null false;
    };
  };

  public func deleteInternship(
    internships : List.List<Internship>,
    id : CommonTypes.InternshipId,
  ) : Bool {
    let before = internships.size();
    let filtered = internships.filter(func(i : Internship) : Bool { i.id != id });
    internships.clear();
    internships.append(filtered);
    internships.size() < before;
  };

  public func getInternships(internships : List.List<Internship>) : [Internship] {
    internships.toArray();
  };

  public func getInternshipById(
    internships : List.List<Internship>,
    id : CommonTypes.InternshipId,
  ) : ?Internship {
    internships.find(func(i : Internship) : Bool { i.id == id });
  };
};

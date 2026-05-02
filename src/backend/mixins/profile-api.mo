import List "mo:core/List";
import Principal "mo:core/Principal";
import ProfileLib "../lib/profile";
import ProfileTypes "../types/profile";

mixin (profiles : List.List<ProfileTypes.Profile>) {
  public shared query ({ caller }) func getMyProfile() : async ProfileTypes.Profile {
    ProfileLib.getProfile(profiles, caller);
  };

  public shared ({ caller }) func updateMyProfile(input : {
    name : Text;
    rollNumber : Text;
    course : Text;
    year : Nat;
    semester : Nat;
    email : Text;
    phone : Text;
  }) : async () {
    let profile : ProfileTypes.Profile = {
      principal = caller;
      name = input.name;
      rollNumber = input.rollNumber;
      course = input.course;
      year = input.year;
      semester = input.semester;
      email = input.email;
      phone = input.phone;
      enrollmentDate = 0;
    };
    ProfileLib.upsertProfile(profiles, profile);
  };

  public shared query ({ caller = _ }) func getStudentProfile(p : Principal) : async ?ProfileTypes.Profile {
    profiles.find(func(pr : ProfileTypes.Profile) : Bool { Principal.equal(pr.principal, p) });
  };

  public shared query func listStudents() : async [ProfileTypes.Profile] {
    profiles.toArray();
  };
};

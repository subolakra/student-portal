import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import ProfileTypes "../types/profile";

module {
  public type Profile = ProfileTypes.Profile;

  public func getSampleProfile() : Profile {
    {
      principal = Principal.fromText("2vxsx-fae");
      name = "Arjun Sharma";
      rollNumber = "CS2021001";
      course = "B.Tech Computer Science";
      year = 3;
      semester = 6;
      email = "arjun.sharma@university.edu";
      phone = "+91-9876543210";
      enrollmentDate = 1630000000000000000;
    };
  };

  public func getProfile(
    profiles : List.List<Profile>,
    caller : Principal,
  ) : Profile {
    switch (profiles.find(func(p : Profile) : Bool { Principal.equal(p.principal, caller) })) {
      case (?p) p;
      case null getSampleProfile();
    };
  };

  public func upsertProfile(
    profiles : List.List<Profile>,
    profile : Profile,
  ) {
    switch (profiles.findIndex(func(p : Profile) : Bool { Principal.equal(p.principal, profile.principal) })) {
      case (?idx) profiles.put(idx, profile);
      case null profiles.add(profile);
    };
  };
};

import CommonTypes "common";

module {
  public type Profile = {
    principal : Principal;
    name : Text;
    rollNumber : Text;
    course : Text;
    year : Nat;
    semester : Nat;
    email : Text;
    phone : Text;
    enrollmentDate : CommonTypes.Timestamp;
  };
};

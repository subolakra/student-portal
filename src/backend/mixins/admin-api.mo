import Principal "mo:core/Principal";

mixin () {
  public shared query ({ caller }) func isAdmin() : async Bool {
    not caller.isAnonymous();
  };
};

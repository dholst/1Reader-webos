describe("1Password", function() {
  var loadTime = 100;
  var keychain;
  var successCallback;

  beforeEach(function() {
    successCallback = jasmine.createSpy("successCallback");
    loadKeychain();
  });

  it("should unlock keychain", function() {
    expect(keychain.unlock("password")).toEqual(true);
  });

  it("should not unlock with invalid password", function() {
    expect(keychain.unlock("invalid password")).toEqual(false);
  });

  it("should get all groups from keychain", function() {
    expect(keychain.groups().length).toEqual(7);
    checkGroup(0, "Logins", 2);
    checkGroup(1, "Identities", 0);
    checkGroup(2, "Secure Notes", 0);
    checkGroup(3, "Software", 0);
    checkGroup(4, "Wallet", 0);
    checkGroup(5, "Passwords", 1);
    checkGroup(6, "Trash", 0 );
  });

  describe("decryption", function() {
    beforeEach(function() {
      keychain.unlock("password");
    });

    it("should decrypt logins", function() {
      var logins = keychain.groups()[0];
      expect(logins.length).toEqual(2);
      expect(logins[0].title).toEqual("login 1");
      expect(logins[1].title).toEqual("login 2");

      var item;

      runs(function() {
        keychain.loadItem(logins[0], function(i) {item = i});
      });

      waits(loadTime);

      runs(function() {
        expect(item).toBeDefined();
        var fields = item.fields();
        expect(fields.length).toEqual(2);
        expect(fields[0].name).toEqual("username");
        expect(fields[0].value).toEqual("login1");
        expect(fields[1].name).toEqual("password");
        expect(fields[1].value).toEqual("password1");
      });
    });
  });

  function checkGroup(index, name, count) {
    var group = keychain.groups()[index];
    expect(group.name).toEqual(name);
    expect(group.length).toEqual(count);
  }

  function loadKeychain() {
    runs(function() {
      keychain = AgileKeychain.create("http://localhost:8888/spec/support/1Password.agilekeychain/", successCallback);
    });

    waits(loadTime);

    runs(function() {
      expect(successCallback).wasCalled();
    });
  }
});

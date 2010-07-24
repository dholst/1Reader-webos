describe("AgileKeychain", function() {
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
    checkGroup(0, "Logins", 1);
    checkGroup(1, "Identities", 1);
    checkGroup(2, "Notes", 1);
    checkGroup(3, "Software", 1);
    checkGroup(4, "Wallet", 2);
    checkGroup(5, "Passwords", 1);
    checkGroup(6, "Trash", 1);
  });

  describe("decryption", function() {
    beforeEach(function() {
      keychain.unlock("password");
    });

    it("should decrypt logins", function() {
      loadItems(0, "Logins");

      runs(function() {
        expect(this.items.first().title).toEqual("login 1");
        expect(this.items.first().isLogin).toEqual(true);
        loadItem(this.items.first());
      });

      runs(function() {
        expect(this.item.loginUsername()).toEqual("login1");
        expect(this.item.loginPassword()).toEqual("password1");
      })
    });

    it("should decrypt notes", function() {
      loadItems(2, "Notes");

      runs(function() {
        expect(this.items.first().title).toEqual("secure note 1");
        expect(this.items.first().isNote).toEqual(true);
        loadItem(this.items.first());
      });

      runs(function() {
        expect(this.item.decrypted_secure_contents.notesPlain).toEqual("secure notes");
      })
    });

    function loadItems(index, name) {
      runs(function() {
        this.items = keychain.groups()[index];
        expect(this.items.name).toEqual(name);
      })
    }

    function loadItem(item) {
      runs(function() {
        keychain.loadItem(item, function(i) {this.item = i}.bind(this));
      });

      waits(loadTime);
    }
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

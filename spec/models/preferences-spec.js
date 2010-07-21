describe("Preferences", function() {
  it("should find keychain location", function() {
    spyOn(Mojo.Model, "Cookie").andReturn({get: function() {
      return "the keychain location"
    }})

    expect(Preferences.keychainLocation()).toEqual("the keychain location")

    expect(Mojo.Model.Cookie).wasCalledWith("keychain-location")
  })

  it("should return null keychain location", function() {
    spyOn(Mojo.Model, "Cookie").andReturn(null)

    expect(Preferences.keychainLocation()).toEqual(null)
  })
})
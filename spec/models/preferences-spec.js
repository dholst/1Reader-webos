describe("Preferences", function() {
  var cookie

  beforeEach(function() {
    cookie = {get: function() {}, put: function() {}}
    spyOn(Preferences, "cookieFor").andReturn(cookie)
  })

  it("should set keychain location", function() {
    spyOn(cookie, "put")
    Preferences.setKeychainLocation("the location")
    expect(cookie.put).wasCalledWith("the location")
    expect(Preferences.cookieFor).wasCalledWith(Preferences.KEYCHAIN_LOCATION)
  })

  it("should find keychain location", function() {
    spyOn(cookie, "get").andReturn("the keychain location")
    expect(Preferences.getKeychainLocation()).toEqual("the keychain location")
    expect(Preferences.cookieFor).wasCalledWith(Preferences.KEYCHAIN_LOCATION)
  })
})
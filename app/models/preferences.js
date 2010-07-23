Preferences = {
  KEYCHAIN_LOCATION: "keychain-location",

  getKeychainLocation: function() {
    return this.cookieFor(this.KEYCHAIN_LOCATION).get()
  },

  setKeychainLocation: function(value) {
    this.cookieFor(this.KEYCHAIN_LOCATION).put(value)
  },

  cookieFor: function(name) {
    return new Mojo.Model.Cookie(name)
  }
}
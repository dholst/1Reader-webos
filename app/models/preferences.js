Preferences = {
  KEYCHAIN_LOCATION: "keychain-location",
  DROPBOX_ACCESS_TOKEN: "dropbox-access-token",

  getKeychainLocation: function() {
    return this.cookieFor(this.KEYCHAIN_LOCATION).get()
  },

  setKeychainLocation: function(value) {
    this.cookieFor(this.KEYCHAIN_LOCATION).put(value)
  },

  getDropboxAccessToken: function() {
    return this.cookieFor(this.DROPBOX_ACCESS_TOKEN).get()
  },

  setDropboxAccessToken: function(accessToken) {
    this.cookieFor(this.DROPBOX_ACCESS_TOKEN).put(accessToken)
  },

  cookieFor: function(name) {
    return new Mojo.Model.Cookie(name)
  }
}
Preferences = {
  KEYCHAIN_LOCATION: "keychain-location",
  DROPBOX_ACCESS_TOKEN: "dropbox-access-token",
  DROPBOX_LOCATION: "dropbox-location",
  USE_DROPBOX: "use-dropbox",

  getKeychainLocation: function() {
    return this.getCookie(this.KEYCHAIN_LOCATION, "/media/internal/1Password.agilekeychain")
  },

  setKeychainLocation: function(value) {
    this.setCookie(this.KEYCHAIN_LOCATION, value)
  },

  getDropboxAccessToken: function() {
    return this.getCookie(this.DROPBOX_ACCESS_TOKEN)
  },

  setDropboxAccessToken: function(accessToken) {
    this.setCookie(this.DROPBOX_ACCESS_TOKEN, accessToken)
  },

  getDropboxLocation: function() {
    return this.getCookie(this.DROPBOX_LOCATION, "/1Password/1Password.agilekeychain")
  },

  setDropboxLocation: function(location) {
    this.setCookie(this.DROPBOX_LOCATION, location)
    },

  getCookie: function(name, defaultValue) {
    var cookie = this.cookieFor(name)

    if(cookie.get()) {
      return cookie.get()
    }
    else {
      return defaultValue
    }
  },

  setCookie: function(name, value) {
    this.cookieFor(name).put(value)
  },

  cookieFor: function(name) {
    return new Mojo.Model.Cookie(name)
  }
}
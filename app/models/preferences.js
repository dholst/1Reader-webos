Preferences = Class.create({
})

Preferences.keychainLocation = function() {
  var cookie = Mojo.Model.Cookie("keychain-location")

  if(cookie == null) {
    return null
  }

  return cookie.get()
}
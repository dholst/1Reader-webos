var LoadAssistant = Class.create(BaseAssistant, {
  activate: function() {
    this.spinnerOn("Loading keychain...")

    setTimeout(function() {
      AgileKeychain.create(Preferences.getKeychainLocation(), this.loaded.bind(this), this.notFound.bind(this))
    }.bind(this), 1000)
  },

  loaded: function(keychain) {
    this.controller.stageController.swapScene('locked', keychain)
  },

  notFound: function() {
    this.controller.stageController.swapScene('not-found', true)
  }
})
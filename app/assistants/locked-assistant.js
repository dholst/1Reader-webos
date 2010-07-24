LockedAssistant = Class.create(BaseAssistant, {
  initialize: function() {
    this.password = {value: ""}
    this.button = {buttonLabel: "Unlock", disabled: false}
    this.allowPreferences = true
  },

  setup: function($super) {
    $super()
    this.controller.setupWidget("password", {}, this.password)
    this.controller.setupWidget("unlock", {}, this.button)
    this.controller.listen("unlock", Mojo.Event.tap, this.unlock = this.unlock.bind(this))
  },

  activate: function() {
    this.spinnerOn("loading keychain...")
    AgileKeychain.create(Preferences.getKeychainLocation(), this.keychainLoaded.bind(this), this.keychainNotFound.bind(this))
  },

  keychainLoaded: function(keychain) {
    this.keychain = keychain
    this.spinnerOff()
  },

  keychainNotFound: function() {
    this.controller.stageController.swapScene("not-found")
  },

  unlock: function() {
    this.spinnerOn("checking password...")
    
    if(this.keychain.unlock(this.password.value)) {
      $("invalid-password").hide()
      this.password.value = ""
      this.controller.modelChanged(this.password)
      this.controller.stageController.pushScene("groups", this.keychain)
    }
    else {
      $("invalid-password").show()
    }

    this.spinnerOff()
  }
})

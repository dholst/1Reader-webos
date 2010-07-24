LockedAssistant = Class.create(BaseAssistant, {
  initialize: function(keychain, unlocked) {
    this.keychain = keychain
    this.unlocked = unlocked
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
    if(this.keychain) {
      if(this.unlocked) {
        this.controller.stageController.pushScene("groups", this.keychain)
        this.keychain = null
      }
      else {
        $("invalid-password").show()
      }
    }
    else {
      this.spinnerOn("loading keychain...")
      AgileKeychain.create(Preferences.getKeychainLocation(), this.keychainLoaded.bind(this), this.keychainNotFound.bind(this))
    }
  },

  keychainLoaded: function(keychain) {
    this.keychain = keychain
    this.spinnerOff()
  },

  keychainNotFound: function() {
    this.controller.stageController.swapScene("not-found")
  },

  unlock: function() {
    this.controller.stageController.swapScene('unlock', this.keychain, this.password.value)
  }
})

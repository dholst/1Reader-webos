LockedAssistant = Class.create(BaseAssistant, {
  initialize: function() {
    this.password = {value: ""}
    this.button = {buttonLabel: "Unlock", disabled: true}
    this.allowPreferences = true
  },

  setup: function($super) {
    $super()
    this.controller.setupWidget("password", {}, this.password)
    this.controller.listen("unlock", Mojo.Event.tap, this.unlock = this.unlock.bind(this))
    this.controller.setupWidget("unlock", {type: Mojo.Widget.activityButton}, this.button)
  },

  createKeychain: function(location) {
    this.spinnerOn()
    AgileKeychain.create(location, this.keychainLoaded.bind(this), this.keychainNotFound.bind(this))
  },

  activate: function() {
    this.createKeychain(Preferences.getKeychainLocation())
  },

  keychainLoaded: function(keychain) {
    this.keychain = keychain
    this.spinnerOff()
  },

  keychainNotFound: function() {
    this.controller.stageController.swapScene("not-found")
  },

  unlock: function() {
    if(this.keychain.unlock(this.password.value)) {
      $("invalid-password").hide()
      this.password.value = ""
      this.controller.modelChanged(this.password)
      this.controller.stageController.pushScene("groups", this.keychain)
    }
    else {
      $("invalid-password").show()
    }
  }
})

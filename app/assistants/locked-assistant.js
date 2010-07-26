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
    this.controller.setupWidget("password", {autoFocus: true, changeOnKeyPress: true}, this.password)
    this.controller.setupWidget("unlock", {}, this.button)
    this.controller.listen("unlock", Mojo.Event.tap, this.unlock = this.unlock.bind(this))
    this.controller.listen("password", Mojo.Event.propertyChange, this.passwordChanged = this.passwordChanged.bind(this))
    OneReader.Metrix.checkBulletinBoard(this.controller)
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("unlock", Mojo.Event.tap, this.unlock)
    this.controller.stopListening("password", Mojo.Event.propertyChanged, this.passwordChanged)
  },

  activate: function() {
    $("password").mojo.setConsumesEnterKey(false)
    $("password").mojo.focus()

    if(this.keychain) {
      if(this.unlocked) {
        this.controller.stageController.pushScene("groups", this.keychain)
      }
      else if(this.unlocked == false) {
        $("invalid-password").show()
      }
    }
    else {
      AgileKeychain.create(Preferences.getKeychainLocation(), this.loaded.bind(this), this.notFound.bind(this))
    }
  },

  deactivate: function() {
    this.keychain = null
  },

  loaded: function(keychain) {
    this.keychain = keychain
  },

  notFound: function() {
    this.controller.stageController.swapScene('not-found')  
  },

  passwordChanged: function(event) {
    if(Mojo.Char.enter === event.originalEvent.keyCode) {
      this.unlock()
    }
  },

  unlock: function() {
    this.controller.stageController.swapScene('unlock', this.keychain, this.password.value)
  }
})

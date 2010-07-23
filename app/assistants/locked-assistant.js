LockedAssistant = Class.create(BaseAssistant, {
  initialize: function() {
    this.password = {value: ""}
  },

  setup: function($super) {
    $super()
    this.controller.setupWidget("password", {}, this.password)
    this.controller.listen("unlock", Mojo.Event.tap, this.unlock = this.unlock.bind(this))
    this.controller.setupWidget(
      Mojo.Menu.appMenu,
      {omitDefaultItems: true},
      {
        visible: true,
        items: [
          Mojo.Menu.editItem,
          {label: "Preferences", command: Mojo.Menu.prefsCmd},            
          {label: "Help", command: Mojo.Menu.helpCmd}
        ]
      }
    )
  },

  activate: function() {
    var location = Preferences.getKeychainLocation()

    if(location && location.length) {
      this.createKeychain(location)
    }
    else {
      this.controller.stageController.pushScene("preferences")
    }
  },

  createKeychain: function(location) {
    this.spinnerOn()

    this.keychain = AgileKeychain.create(location, function() {
      this.spinnerOff()
    }.bind(this))
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
  },

  handleCommand: function($super, event) {
    if(event.command === Mojo.Menu.prefsCmd) {
      this.controller.stageController.pushScene("preferences")
      event.stop()
    }
    else {
      $super(event)
    }
  }
})

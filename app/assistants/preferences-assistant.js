var PreferencesAssistant = Class.create(BaseAssistant, {
  initialize: function() {
    this.syncDropbox = {}
  },

  setup: function($super) {
    $super()
    this.controller.setupWidget("dropbox-sync", {}, this.syncDropbox)
    this.controller.listen("dropbox-sync", Mojo.Event.propertyChanged, this.syncDropboxChanged = this.syncDropboxChanged.bind(this))
    this.controller.listen('keychain-location-group', Mojo.Event.tap, this.selectKeychainLocation = this.selectKeychainLocation.bind(this))
    this.controller.listen('dropbox-location-group', Mojo.Event.tap, this.selectDropboxLocation = this.selectDropboxLocation.bind(this))
    this.setCurrentPreferences()
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("dropbox-sync", Mojo.Event.propertyChanged, this.syncDropboxChanged)
    this.controller.stopListening('keychain-location-group', Mojo.Event.tap, this.selectKeychainLocation)
    this.controller.stopListening('dropbox-location-group', Mojo.Event.tap, this.selectKeychainLocation)
  },

  syncDropboxChanged: function() {
    if(this.syncDropbox.value) {
      this.showDropbox()
    }
    else {
      this.hideDropbox()
    }
  },

  showDropbox: function() {
    this.controller.get("keychain-location-group").hide()
    this.controller.get("dropbox-location-group").show()
  },

  hideDropbox: function() {
    this.controller.get("keychain-location-group").show()
    this.controller.get("dropbox-location-group").hide()
  },

  setCurrentPreferences: function() {
    this.controller.update("keychain-location", Preferences.getKeychainLocation())
    this.hideDropbox()
  },

  selectDropboxLocation: function() {
    this.controller.stageController.pushScene("dropbox-folder-select")
  },
  
  selectKeychainLocation: function() {
    var params = {
      kind: "file",
      extensions: ["html"],
      onSelect: this.keychainSelected.bind(this)
    }

    Mojo.FilePicker.pickFile(params, this.controller.stageController)
  },
  
  keychainSelected: function(response) {
    var i = response.fullPath.indexOf("1Password.html")

    if(i) {
      Preferences.setKeychainLocation(response.fullPath.substring(0, i))
    }
    else {
      Preferences.setKeychainLocation('')
    }

    this.setCurrentPreferences()
  }
})
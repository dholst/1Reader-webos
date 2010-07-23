var PreferencesAssistant = Class.create(BaseAssistant, {
  setup: function($super) {
    $super()
    this.controller.setupWidget('sync-dropbox', {}, {buttonLabel: "Sync"})
    this.controller.listen('keychain-location-group', Mojo.Event.tap, this.selectKeychainLocation = this.selectKeychainLocation.bind(this))
    this.controller.listen('dropbox-location-group', Mojo.Event.tap, this.selectDropboxLocation = this.selectDropboxLocation.bind(this))
  },

  activate: function() {
    this.setCurrentPreferences()
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening('keychain-location-group', Mojo.Event.tap, this.selectKeychainLocation)
    this.controller.stopListening('dropbox-location-group', Mojo.Event.tap, this.selectKeychainLocation)
  },

  setCurrentPreferences: function() {
    this.controller.update("keychain-location", Preferences.getKeychainLocation())
    this.controller.update("dropbox-location", Preferences.getDropboxLocation())
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

    this.setCurrentPreferences()
  }
})
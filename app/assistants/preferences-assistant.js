var PreferencesAssistant = Class.create(BaseAssistant, {
  initialize: function() {
    this.keychainLocation = {}
  },

  setup: function($super) {
    $super()
    this.controller.setupWidget('sync-dropbox', {}, {buttonLabel: "Sync"})
    this.controller.setupWidget('keychain-location', {changeOnKeyPress: true}, this.keychainLocation)
    this.controller.listen('dropbox-location', Mojo.Event.tap, this.selectDropboxLocation = this.selectDropboxLocation.bind(this))
    this.controller.listen('sync-dropbox', Mojo.Event.tap, this.syncDropbox = this.syncDropbox.bind(this))
    this.controller.listen('keychain-location', Mojo.Event.propertyChange, this.saveKeychainLocation = this.saveKeychainLocation.bind(this))
  },

  activate: function() {
    this.setCurrentPreferences()
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening('dropbox-location', Mojo.Event.tap, this.selectDropboxLocation)
    this.controller.stopListening('sync-dropbox', Mojo.Event.tap, this.syncDropbox)
    this.controller.stopListening('keychain-location', Mojo.Event.propertyChange, this.saveKeychainLocation)
  },

  saveKeychainLocation: function() {
    var location = this.keychainLocation.value

    if(location.endsWith('/')) {
      location = location.substr(0, location.length - 1)
    }

    Preferences.setKeychainLocation(location)
  },

  setCurrentPreferences: function() {
    this.keychainLocation.value = Preferences.getKeychainLocation()
    this.controller.modelChanged(this.keychainLocation)
    this.controller.update("dropbox-location", Preferences.getDropboxLocation())
  },

  selectDropboxLocation: function() {
    this.controller.stageController.pushScene("dropbox-folder-select")
  },

  syncDropbox: function() {
    this.controller.stageController.pushScene("dropbox-sync")
  }
})
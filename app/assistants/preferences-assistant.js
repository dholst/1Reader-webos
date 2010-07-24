var PreferencesAssistant = Class.create(BaseAssistant, {
  initialize: function() {
    this.keychainLocation = {}
  },

  setup: function($super) {
    $super()
    this.controller.setupWidget('sync-dropbox', {}, {buttonLabel: "Sync"})
    this.controller.setupWidget('keychain-location', {}, this.keychainLocation)
    this.controller.listen('dropbox-location', Mojo.Event.tap, this.selectDropboxLocation = this.selectDropboxLocation.bind(this))
    this.controller.listen('sync-dropbox', Mojo.Event.tap, this.syncDropbox = this.syncDropbox.bind(this))
  },

  activate: function() {
    this.setCurrentPreferences()
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening('dropbox-location', Mojo.Event.tap, this.selectKeychainLocation)
    this.controller.stopListening('sync-dropbox', Mojo.Event.tap, this.syncDropbox)
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
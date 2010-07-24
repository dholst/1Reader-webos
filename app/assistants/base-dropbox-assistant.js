var BaseDropboxAssistant = Class.create(BaseAssistant, {
  activate: function() {
    this.accessToken = Preferences.getDropboxAccessToken()

    if(this.accessToken == null) {
      this.authenticate()
    }
    else {
      this.spinnerOn("Authenticating...")
      Dropbox.checkAccessToken(this.accessToken, this.whenAuthenticated, this.authenticate.bind(this))
    }
  },

  authenticate: function() {
    this.controller.stageController.swapScene('dropbox-authentication', this.sceneName)
  }
})
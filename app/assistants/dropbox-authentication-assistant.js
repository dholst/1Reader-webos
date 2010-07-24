var DropboxAuthenticationAssistant = Class.create(BaseAssistant, {
  initialize: function(backTo) {
    this.backTo = backTo
    this.user = {username: "", password: ""}
    this.button = {buttonLabel: "Login", disabled: true}
  },

  setup: function($super) {
    $super()
    this.controller.setupWidget("username", {modelProperty: "username", changeOnKeyPress: true, focus: true}, this.user)
    this.controller.setupWidget("password", {modelProperty: "password", changeOnKeyPress: true}, this.user)
    this.controller.setupWidget("authenticate", {type: Mojo.Widget.activityButton}, this.button)

    this.propertyChanged = this.propertyChanged.bind(this)
    this.authenticate = this.authenticate.bind(this)

    this.controller.listen("username", Mojo.Event.propertyChange, this.propertyChanged)
    this.controller.listen("password", Mojo.Event.propertyChange, this.propertyChanged)
    this.controller.listen("authenticate", Mojo.Event.tap, this.authenticate)
  },

  activate: function() {
    $("password").mojo.setConsumesEnterKey(false)
    this.propertyChanged()
  },

  propertyChanged: function(event) {
    if(this.user.username.length && this.user.password.length) {
      this.enableButton()

      if(Mojo.Char.enter === event.originalEvent.keyCode) {
        this.authenticate()
      }
    }
    else {
      this.disableButton()
    }
  },

  disableButton: function() {
    this.button.disabled = true
    this.controller.modelChanged(this.button)
  },

  enableButton: function() {
    this.button.disabled = false
    this.controller.modelChanged(this.button)
    this.controller.get("authenticate").mojo.deactivate()
  },

  authenticate: function() {
    this.controller.get('authentication-failure').hide()
    Dropbox.getAccessTokenFor(this.user.username, this.user.password, this.authenticated.bind(this), this.notAuthenticated.bind(this))
  },

  authenticated: function(accessToken) {
    Preferences.setDropboxAccessToken(accessToken)
    this.controller.stageController.swapScene(this.backTo)
  },

  notAuthenticated: function() {
    this.controller.get('authentication-failure').show()
  }
})
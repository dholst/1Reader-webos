BaseAssistant = Class.create({
  setup: function() {
    this.controller.setupWidget("spinner", {spinnerSize: Mojo.Widget.spinnerLarge}, {})

    var appMenuItems = []
    appMenuItems.push(Mojo.Menu.editItem)
    if(this.allowPreferences) appMenuItems.push({label: "Preferences", command: Mojo.Menu.prefsCmd})
    appMenuItems.push({label: "Help", command: Mojo.Menu.helpCmd})

    this.controller.setupWidget(
      Mojo.Menu.appMenu,
      {omitDefaultItems: true},
      {
        visible: true,
        items: appMenuItems
      }
    )
  },

  cleanup: function() {
  },

  spinnerOn: function(message) {
    var spinner = $$(".spinner").first()
    spinner.mojo.start()
    $$(".palm-scrim").first().show()

    var spinnerMessage = $("spinner-message")

    if(!spinnerMessage) {
      spinner.insert({after: '<div id="spinner-message" class="spinner-message palm-info-text"></div>'})
      spinnerMessage = $("spinner-message")
    }

    spinnerMessage.update(message || "")
  },

  spinnerOff: function() {
    $("spinner-message").remove()
    $$(".spinner").first().mojo.stop()
    $$(".palm-scrim").first().hide()
  },

  handleCommand: function(event) {
    if(Mojo.Menu.helpCmd == event.command) {
      this.controller.stageController.pushScene("help")
      event.stop()
    }
    else if(Mojo.Menu.prefsCmd == event.command) {
      this.controller.stageController.pushScene("preferences")
      event.stop()
    }
  },

  copy: function(event) {
    if(event.originalEvent && event.originalEvent.target && event.originalEvent.target.hasClassName("copyable")) {
      this.controller.popupSubmenu({
        onChoose: this.copyIt.bind(this, event.originalEvent.target),
        placeNear: event.originalEvent.target,
        items: [{label: "Copy", command: "copy"}]
      })
    }
  },

  copyIt: function(element, command) {
    if("copy" === command) {
      this.controller.stageController.setClipboard(element.innerHTML);
    }
  }
})

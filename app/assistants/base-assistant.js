BaseAssistant = Class.create({
  setup: function() {
    this.controller.setupWidget("spinner", {spinnerSize: Mojo.Widget.spinnerLarge}, {})

    this.controller.setupWidget(
      Mojo.Menu.appMenu,
      {omitDefaultItems: true},
      {
        visible: true,
        items: [
          Mojo.Menu.editItem,
          {label: "Help", command: Mojo.Menu.helpCmd}
        ]
      }
    )
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
  }
})

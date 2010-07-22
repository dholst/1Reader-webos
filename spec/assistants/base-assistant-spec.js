describe("BaseAssistant", function() {
  var assistant

  beforeEach(function() {
    assistant = new BaseAssistant()
    assistant.controller = new SceneControllerStub()
  })

  it("should setup app menu on setup", function() {
    spyOn(assistant.controller, "setupWidget")

    assistant.setup()

    expect(assistant.controller.setupWidget).wasCalledWith("spinner", {spinnerSize: Mojo.Widget.spinnerLarge}, {})
    expect(assistant.controller.setupWidget).wasCalledWith(
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
  })

  it("should handle help command", function() {
    var event = {command: Mojo.Menu.helpCmd, stop: function() {}}
    spyOn(assistant.controller.stageController, "pushScene")
    spyOn(event, "stop")

    assistant.handleCommand(event)

    expect(assistant.controller.stageController.pushScene).wasCalledWith("help")
    expect(event.stop).wasCalled()
  })
})
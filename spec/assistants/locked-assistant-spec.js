describe("LockedAssistant", function() {
  var assistant
  var cookie

  beforeEach(function() {
    assistant = new LockedAssistant()
    assistant.controller = new SceneControllerStub()
  })

  it("should setup", function() {
    spyOn(assistant.controller, "setupWidget")
    spyOn(assistant.controller, "listen")

    assistant.setup()

    expect(assistant.controller.listen).wasCalledWith("unlock", Mojo.Event.tap, assistant.unlock)
    expect(assistant.controller.setupWidget).wasCalledWith("password", {}, assistant.password)
    expect(assistant.controller.setupWidget).wasCalledWith(
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
  })

  it("should show error if keychain not found", function() {
    spyOn(Preferences, "keychainLocation").andReturn(null)
    spyOn(assistant.controller.stageController, "pushScene")

    assistant.activate()

    expect(assistant.controller.stageController.pushScene).wasCalledWith("preferences")
  })

  it("should create keychain if location available", function() {
    spyOn(Preferences, "keychainLocation").andReturn("location")
    spyOn(assistant, "createKeychain")

    assistant.activate()

    expect(assistant.createKeychain).wasCalledWith("location")
  })

  it("should create keychain from location", function() {
    spyOn(AgileKeychain, "create")
    spyOn(assistant, "spinnerOn")
    spyOn(assistant, "spinnerOff")

    assistant.createKeychain("/full/path/")

    expect(assistant.spinnerOn).wasCalled()
    expect(AgileKeychain.create).wasCalledWith("/full/path/", jasmine.any(Function))
    AgileKeychain.create.mostRecentCall.args[1]()
    expect(assistant.spinnerOff).wasCalled()
  })

  it("should unlock the keychain and push to the next scene", function() {
    assistant.password.value = "password"
    assistant.keychain = new KeychainStub()
    spyOn(assistant.keychain, "unlock").andReturn(true)
    spyOn(assistant.controller.stageController, "pushScene")
    var element = jasmine.createSpyObj("element", ["hide"])
    spyOn(GLOBAL, "$").andReturn(element)

    assistant.unlock()

    expect(assistant.keychain.unlock).wasCalledWith("password")
    expect(GLOBAL.$).wasCalledWith("invalid-password")
    expect(element.hide).wasCalled()
    expect(assistant.controller.stageController.pushScene).wasCalledWith("groups", assistant.keychain)
  })

  it("should show error when password is invalid", function() {
    assistant.password.value = "password"
    assistant.keychain = new KeychainStub()
    spyOn(assistant.keychain, "unlock").andReturn(false)
    var element = jasmine.createSpyObj("element", ["show"])
    spyOn(GLOBAL, "$").andReturn(element)

    assistant.unlock()

    expect(assistant.keychain.unlock).wasCalledWith("password")
    expect(GLOBAL.$).wasCalledWith("invalid-password")
    expect(element.show).wasCalled()
  })

  it("should handle preferences command", function() {
    var event = {command: Mojo.Menu.prefsCmd, stop: function() {}}
    spyOn(assistant.controller.stageController, "pushScene")
    spyOn(event, "stop")

    assistant.handleCommand(event)

    expect(assistant.controller.stageController.pushScene).wasCalledWith("preferences")
    expect(event.stop).wasCalled()
  })
})

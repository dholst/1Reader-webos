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

    expect(assistant.controller.setupWidget).wasCalledWith("password", {}, assistant.password)
    expect(assistant.controller.listen).wasCalledWith("unlock", Mojo.Event.tap, assistant.unlock)
  })

  it("should let the user choose the file if cookie not set", function() {
    spyOn(Preferences, "keychainLocation").andReturn(null)
    spyOn(assistant, "showFirstTime")

    assistant.ready()

    expect(assistant.showFirstTime).wasCalled()
  })

  it("should create keychain if cookie is set", function() {
    spyOn(Preferences, "keychainLocation").andReturn("location")
    spyOn(assistant, "createKeychain")

    assistant.ready()

    expect(assistant.createKeychain).wasCalledWith("location")
  })

  it("should create keychain and set cookie", function() {
    spyOn(assistant, "showPasswordEntry")
    spyOn(AgileKeychain, "create")
    spyOn(assistant, "spinnerOn")
    spyOn(assistant, "spinnerOff")

    assistant.createKeychain("/full/path/")

    expect(assistant.showPasswordEntry).wasCalled()
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
})

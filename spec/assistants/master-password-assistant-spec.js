describe("MasterPasswordAssistant", function() {
  var keychain;
  var assistant;
  
  beforeEach(function() {
    keychain = new KeychainStub();
    assistant = new MasterPasswordAssistant(keychain);
    assistant.controller = new SceneControllerStub();
  });
  
  it("should setup", function() {
    spyOn(assistant.controller, "setupWidget");
    spyOn(assistant.controller, "listen");
    
    assistant.setup();
    
    expect(assistant.controller.setupWidget).wasCalledWith("password", {}, assistant.password);
    expect(assistant.controller.setupWidget).wasCalledWith("unlock", {}, {buttonLabel: "Unlock"});
    expect(assistant.controller.listen).wasCalledWith("unlock", Mojo.Event.tap, assistant.unlock);
  });
  
  it("should unlock the keychain and push to the next scene", function() {
    assistant.password.value = "password";
    spyOn(keychain, "unlock").andReturn(true);
    spyOn(assistant.controller.stageController, "pushScene");
    var element = jasmine.createSpyObj("element", ["hide"]);
    spyOn(GLOBAL, "$").andReturn(element);
    
    assistant.unlock();
    
    expect(keychain.unlock).wasCalledWith("password");
    expect(GLOBAL.$).wasCalledWith("invalid-password");
    expect(element.hide).wasCalled();
    expect(assistant.controller.stageController.pushScene).wasCalledWith("groups", keychain);
  });
  
  it("should show error when password is invalid", function() {
    assistant.password.value = "password";
    spyOn(keychain, "unlock").andReturn(false);
    var element = jasmine.createSpyObj("element", ["show"]);
    spyOn(GLOBAL, "$").andReturn(element);
    
    assistant.unlock();
    
    expect(keychain.unlock).wasCalledWith("password");
    expect(GLOBAL.$).wasCalledWith("invalid-password");
    expect(element.show).wasCalled();
  })
  
});

describe("MasterPasswordAssistant", function() {
  var assistant;
  var cookie;
  
  beforeEach(function() {
    assistant = new MasterPasswordAssistant();
    assistant.controller = new SceneControllerStub();
    assistant.cookie = {get: null, put: null};
  });
  
  it("should setup", function() {
    spyOn(assistant.controller, "setupWidget");
    spyOn(assistant.controller, "listen");
    spyOn(assistant, "getCookie").andReturn("cookie");
    
    assistant.setup();
    
    expect(assistant.controller.setupWidget).wasCalledWith("password", {}, assistant.password);
    expect(assistant.controller.listen).wasCalledWith("unlock", Mojo.Event.tap, assistant.unlock);
    expect(assistant.controller.listen).wasCalledWith("try-again", Mojo.Event.tap, assistant.pickFile);
    expect(assistant.controller.listen).wasCalledWith("pick-one", Mojo.Event.tap, assistant.pickFile);
    expect(assistant.cookie).toEqual("cookie");
  });
  
  it("should let the user choose the file if cookie not set", function() {
    spyOn(assistant.cookie, "get").andReturn(null);
    spyOn(assistant, "showFirstTime");
    
    assistant.ready();
    
    expect(assistant.showFirstTime).wasCalled();
  });
  
  it("should create keychain if cookie is set", function() {
    spyOn(assistant, "getCookie").andReturn(cookie);
    spyOn(assistant.cookie, "get").andReturn("location");
    spyOn(assistant, "createKeychain");
    
    assistant.ready();
    
    expect(assistant.createKeychain).wasCalledWith("location");
  });
  
  it("should create keychain and set cookie", function() {
    spyOn(assistant, "showPasswordEntry");
    spyOn(assistant.cookie, "put");
    spyOn(AgileKeychain, "create");
    spyOn(assistant, "spinnerOn");
    spyOn(assistant, "spinnerOff");
    
    assistant.createKeychain("/full/path/");
      
    expect(assistant.showPasswordEntry).wasCalled();
    expect(assistant.spinnerOn).wasCalled();
    expect(AgileKeychain.create).wasCalledWith("/full/path/", jasmine.any(Function));
    AgileKeychain.create.mostRecentCall.args[1]();
    expect(assistant.spinnerOff).wasCalled();
    expect(assistant.cookie.put).wasCalledWith("/full/path/");
  });
  
  it("should hide password entry if location is empty", function() {
    spyOn(assistant, "showPasswordEntry");
    spyOn(assistant, "hidePasswordEntry");
    
    assistant.createKeychain("");
    
    expect(assistant.showPasswordEntry).wasCalled();
    expect(assistant.hidePasswordEntry).wasCalled();
  });
  
  it("should unlock the keychain and push to the next scene", function() {
    assistant.password.value = "password";
    assistant.keychain = new KeychainStub();
    spyOn(assistant.keychain, "unlock").andReturn(true);
    spyOn(assistant.controller.stageController, "pushScene");
    var element = jasmine.createSpyObj("element", ["hide"]);
    spyOn(GLOBAL, "$").andReturn(element);
    
    assistant.unlock();
    
    expect(assistant.keychain.unlock).wasCalledWith("password");
    expect(GLOBAL.$).wasCalledWith("invalid-password");
    expect(element.hide).wasCalled();
    expect(assistant.controller.stageController.pushScene).wasCalledWith("groups", assistant.keychain);
  });
  
  it("should show error when password is invalid", function() {
    assistant.password.value = "password";
    assistant.keychain = new KeychainStub();
    spyOn(assistant.keychain, "unlock").andReturn(false);
    var element = jasmine.createSpyObj("element", ["show"]);
    spyOn(GLOBAL, "$").andReturn(element);
    
    assistant.unlock();
    
    expect(assistant.keychain.unlock).wasCalledWith("password");
    expect(GLOBAL.$).wasCalledWith("invalid-password");
    expect(element.show).wasCalled();
  })
});

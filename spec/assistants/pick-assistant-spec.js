describe("PickAssistant", function() {
  var assistant;
  
  beforeEach(function() {
    assistant = new PickAssistant();
    assistant.controller = new SceneControllerStub();
  });
  
  it("should let user pick file on ready", function() {
    spyOn(assistant, "spinnerOn");
    spyOn(Mojo.FilePicker, "pickFile");
    
    assistant.ready();
    
    expect(assistant.spinnerOn).wasCalled();
    var params = {kind: "file", extensions: ["html"], onSelect: assistant.fileSelected}
    expect(Mojo.FilePicker.pickFile).wasCalledWith(params, assistant.controller.stageController);
  });
  
  it("should create new keychain on file selected", function() {
    spyOn(assistant, "spinnerOff");
    spyOn(AgileKeychain, "create").andReturn("the keychain");
    spyOn(assistant.controller.stageController, "swapScene");
    
    assistant.fileSelected({fullPath: "/media/internal/files/foo.agilekeychain/1Password.html"})
    
    expect(AgileKeychain.create).wasCalledWith("/media/internal/files/foo.agilekeychain/", jasmine.any(Function));
    AgileKeychain.create.mostRecentCall.args[1]();
    expect(assistant.spinnerOff).wasCalled();
    expect(assistant.controller.stageController.swapScene).wasCalledWith("groups", "the keychain");
  })
});

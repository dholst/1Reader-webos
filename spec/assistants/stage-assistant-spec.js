describe("StageAssistant", function() {
  it("should push first scene", function() {
    var assistant = new StageAssistant();
    assistant.controller = new StageControllerStub();
    spyOn(assistant.controller, "pushScene");
    
    assistant.setup();
    
    expect(assistant.controller.pushScene).wasCalledWith("pick");
  })
});

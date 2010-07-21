describe("StageAssistant", function() {
  var assistant;

  beforeEach(function() {
    assistant = new StageAssistant();
    assistant.controller = new StageControllerStub();
  });

  it("should push first scene", function() {
    spyOn(Mojo.Event, "listen");
    spyOn(assistant.controller, "pushScene");

    assistant.setup();

    expect(Mojo.Event.listen).wasCalledWith(document, Mojo.Event.tap, assistant.documentTapped);
    expect(assistant.controller.pushScene).wasCalledWith("locked");
  });

  it("should popup copy command when copyable item tapped", function() {
    var element = {hasClassName: null};
    var sceneController = new SceneControllerStub();
    var scene = {assistant: {controller: sceneController}};
    spyOn(element, "hasClassName").andReturn(true);
    spyOn(assistant.controller, "getScenes").andReturn([scene]);
    spyOn(sceneController, "popupSubmenu");

    assistant.documentTapped({target: element});

    expect(element.hasClassName).wasCalledWith("copyable");
    expect(sceneController.popupSubmenu).wasCalledWith(jasmine.any(Object));
  });

  it("should not allow copy if element tapped isn't copyable", function() {
    var element = {hasClassName: null};
    spyOn(element, "hasClassName").andReturn(false);

    assistant.documentTapped({target: element});

    expect(element.hasClassName).wasCalledWith("copyable");
  });

  it("should copy to clipboard on copy", function() {
    var element = {innerHTML: "text"};
    spyOn(assistant.controller, "setClipboard");

    assistant.copy(element, "copy")

    expect(assistant.controller.setClipboard).wasCalledWith("text");
  });

  it("should not copy if command isn't copy", function() {
    spyOn(assistant.controller, "setClipboard");

    assistant.copy()

    expect(assistant.controller.setClipboard).wasNotCalled();
  })
});

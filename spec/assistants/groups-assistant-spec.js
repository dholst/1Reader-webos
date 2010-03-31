describe("GroupsAssistant", function() {
  var assistant;
  var keychain;
  
  beforeEach(function() {
    keychain = new KeychainStub();
    spyOn(keychain, "groups").andReturn(["group1", "group2"]);
    assistant = new GroupsAssistant(keychain);
    assistant.controller = new SceneControllerStub();
  });
  
  it("should setup widgets", function() {
    spyOn(assistant.controller, "setupWidget");
    spyOn(assistant.controller, "listen");
    
    assistant.setup();
    
    expect(assistant.controller.setupWidget).wasCalledWith("groups",  {itemTemplate : 'groups/group'}, {items: ["group1", "group2"]});
    expect(assistant.controller.listen).wasCalledWith("groups", Mojo.Event.listTap, assistant.groupTapped);
  });
  
  it("should push next scene on group tap", function() {
    spyOn(assistant.controller.stageController, "pushScene");
    
    assistant.groupTapped({item: "the group"});
    
    expect(assistant.controller.stageController.pushScene).wasCalledWith("items", keychain, "the group");
  });
});

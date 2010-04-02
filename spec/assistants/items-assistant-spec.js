describe("ItemsAssistant", function() {
  var keychain;
  var assistant;

  beforeEach(function() {
    keychain = new KeychainStub();
    var items = [{title: "Item3"}, {title: "item2"}, {title: "item1"}];
    items.name = "group name"
    assistant = new ItemsAssistant(keychain, items);
    assistant.controller = new SceneControllerStub();
  });

  it("should setup widgets", function() {
    spyOn(assistant.controller, "setupWidget");
    spyOn(assistant.controller, "listen");
    spyOn(assistant.controller, "update");

    assistant.setup();

    expect(assistant.controller.update).wasCalledWith("group-name", "group name");
    expect(assistant.controller.setupWidget).wasCalledWith(
      "items",
      {itemTemplate : 'items/item'},
      {items: [{title: "item1"}, {title: "item2"}, {title: "Item3"}]}
    );

    expect(assistant.controller.listen).wasCalledWith("items", Mojo.Event.listTap, assistant.itemTapped);
  });

  it("should push next scene on item tap", function() {
    spyOn(ItemSceneFactory, "get").andReturn("foo");
    spyOn(assistant.controller.stageController, "pushScene");

    assistant.itemTapped({item: "the item"});

    expect(ItemSceneFactory.get).wasCalledWith("the item");
    expect(assistant.controller.stageController.pushScene).wasCalledWith("foo", keychain, "the item");
  })
});
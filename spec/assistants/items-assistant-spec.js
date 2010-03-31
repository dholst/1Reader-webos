describe("ItemsAssistant", function() {
  var keychain;
  var assistant;

  beforeEach(function() {
    keychain = new KeychainStub();
    assistant = new ItemsAssistant(keychain, [{title: "Item3"}, {title: "item2"}, {title: "item1"}]);
    assistant.controller = new SceneControllerStub();
  });

  it("should setup widgets", function() {
    spyOn(assistant.controller, "setupWidget");
    spyOn(assistant.controller, "listen");

    assistant.setup();

    expect(assistant.controller.setupWidget).wasCalledWith(
      "items",
      {itemTemplate : 'items/item'},
      {items: [{title: "item1"}, {title: "item2"}, {title: "Item3"}]}
    );

    expect(assistant.controller.listen).wasCalledWith("items", Mojo.Event.listTap, assistant.itemTapped);
  });

  it("should push next scene on item tap", function() {
    spyOn(assistant.controller.stageController, "pushScene");

    assistant.itemTapped({item: "the item"});

    expect(assistant.controller.stageController.pushScene).wasCalledWith("item", keychain, "the item");
  })
});
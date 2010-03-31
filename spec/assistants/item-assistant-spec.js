describe("ItemAssistant", function() {
  var keychain;
  var assistant;
  
  beforeEach(function() {
    keychain = new KeychainStub();
    assistant = new ItemAssistant(keychain, "the item");
    assistant.controller = new SceneControllerStub();
  });
  
  it("should load the item and setup the widgets", function() {
    spyOn(assistant.controller, "setupWidget");
    spyOn(keychain, "loadItem");
    
    assistant.setup();
    
    expect(assistant.controller.setupWidget).wasCalledWith("fields", {itemTemplate: 'item/field'}, assistant.fields);
    expect(keychain.loadItem).wasCalledWith("the item", assistant.itemLoaded);
  });
  
  it("should add fields to list on load", function() {
    spyOn(assistant.controller, "modelChanged");
    
    assistant.itemLoaded({fields: function({return ["field1", "field2"]})});
    
    expect(assistant.controller.modelChanged).wasCalledWith(assistant.fields);
    expect(assistant.fields.items).toEqual(["field1", "field2"]);
  })
});

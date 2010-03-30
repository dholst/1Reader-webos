TypesAssistant = Class.create(BaseAssistant, {
  initialize: function(keychain) {
    this.keychain = keychain;
    this.types = {items: this.keychain.groups()};
  },

  setup: function() {
    this.controller.setupWidget("types", {itemTemplate: "types/type"}, this.types);
    this.controller.listen("types", Mojo.Event.listTap, this.listTapped.bind(this));
  },
  
  listTapped: function(event) {
    this.controller.stageController.pushScene("items", this.keychain, event.item);
  }
});

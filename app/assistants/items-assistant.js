ItemsAssistant = Class.create(BaseAssistant, {
  initialize: function(keychain, items) {
    this.keychain = keychain;
    this.items = {items: items.sortBy(function(s){return s.title;})};
  },

  setup: function() {
    this.controller.setupWidget("items", {itemTemplate: "items/item"}, this.items);
    this.controller.listen("items", Mojo.Event.listTap, this.itemTapped.bind(this));
  },

  itemTapped: function(event) {
  }
});

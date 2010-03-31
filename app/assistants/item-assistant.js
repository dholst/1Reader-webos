ItemAssistant = Class.create({
  initialize: function(keychain, item) {
    this.keychain = keychain;
    this.item = item;
    this.fields = {items: []};
  },

  setup: function() {
    this.controller.setupWidget("fields", {itemTemplate : 'item/field'}, this.fields);
    this.keychain.loadItem(this.item, this.itemLoaded = this.itemLoaded.bind(this));
  },

  itemLoaded: function(item) {
    this.fields.items.push.apply(this.fields.items, item.fields());
    this.controller.modelChanged(this.fields);
  }
});

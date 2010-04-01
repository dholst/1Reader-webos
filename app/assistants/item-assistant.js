ItemAssistant = Class.create({
  initialize: function(keychain, item) {
    this.keychain = keychain;
    this.item = item;
  },
  
  setup: function() {
    this.keychain.loadItem(this.item, this.itemLoaded.bind(this));
  }
});

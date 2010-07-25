ItemAssistant = Class.create(BaseAssistant, {
  initialize: function(keychain, item) {
    this.keychain = keychain
    this.item = item
  },
  
  setup: function($super) {
    $super()
    this.keychain.loadItem(this.item, this.itemLoaded.bind(this))
  }
})

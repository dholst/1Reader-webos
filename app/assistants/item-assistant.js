ItemAssistant = Class.create(BaseAssistant, {
  initialize: function(keychain, item) {
    this.keychain = keychain
    this.item = item
  },
  
  setup: function($super) {
    $super()
  },
  
  activate: function() {
    this.spinnerOn("Loading item...")
    
    this.keychain.loadItem(this.item, function(item) {
      this.spinnerOff()
      this.itemLoaded(item)
    }.bind(this))
  }
})

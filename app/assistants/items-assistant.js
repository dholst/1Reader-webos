ItemsAssistant = Class.create(BaseAssistant, {
  initialize: function(keychain, items) {
    this.keychain = keychain
    this.groupName = items.name
    this.items = {items: items.sortBy(function(s){return s.title.toLowerCase()})}
    this.search = {}
  },

  setup: function($super) {
    $super()
    this.controller.update("group-name", this.groupName)
    this.controller.setupWidget("items", {itemTemplate: "items/item"}, this.items)
    this.controller.listen("items", Mojo.Event.listTap, this.itemTapped = this.itemTapped.bind(this))
  },
  
  cleanup: function($super) {
    $super()
    this.controller.stopListening("items", Mojo.Event.listTap, this.itemTapped)
  },

  itemTapped: function(event) {
    this.controller.stageController.pushScene(ItemSceneFactory.get(event.item), this.keychain, event.item)
  }
})

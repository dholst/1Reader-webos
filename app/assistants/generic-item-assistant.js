var GenericItemAssistant = Class.create(ItemAssistant, {
  setup: function($super) {
    $super()
    this.fields = {items: []}
    this.controller.setupWidget("fields", {listTemplate: "generic-item/fields", itemTemplate: "generic-item/field"}, this.fields)
    this.controller.listen("fields", Mojo.Event.listTap, this.copy = this.copy.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.controller.listen("fields", Mojo.Event.listTap, this.copy)
  },

  itemLoaded: function(item) {
    $("title").update(item.title)

    for(var name in item.decrypted_secure_contents) {
      if(name != "notesPlain") {
        this.fields.items.push({name: name + ":", value: item.decrypted_secure_contents[name]})
      }
    }

    this.controller.modelChanged(this.fields)
  }
})
GroupsAssistant = Class.create(BaseAssistant, {
  initialize: function(keychain) {
    this.keychain = keychain;
    this.types = {items: this.keychain.groups()};
  },

  setup: function() {
    this.controller.setupWidget("groups", {itemTemplate: "groups/group"}, this.types);
    this.controller.listen("groups", Mojo.Event.listTap, this.groupTapped = this.groupTapped.bind(this));
  },

  groupTapped: function(event) {
    this.controller.stageController.pushScene("items", this.keychain, event.item);
  }
});

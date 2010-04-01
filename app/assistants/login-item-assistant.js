LoginItemAssistant = Class.create(ItemAssistant, {
  itemLoaded: function(item) {
    item.username = item.loginUsername();
    item.password = item.loginPassword();
    this.controller.update("item-container", Mojo.View.render({object: item, template: "login-item/login-item"}));
  }
});
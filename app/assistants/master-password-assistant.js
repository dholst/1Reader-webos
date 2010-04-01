MasterPasswordAssistant = Class.create({
  initialize: function(keychain) {
    this.keychain = keychain;
    this.password = {value: ""};
  },
  
  setup: function() {
    this.controller.setupWidget("password", {}, this.password);
    this.controller.setupWidget("unlock", {}, {buttonLabel: "Unlock"});
    this.controller.listen("unlock", Mojo.Event.tap, this.unlock = this.unlock.bind(this));
  },
  
  unlock: function() {
    if(this.keychain.unlock(this.password.value)){
      $("invalid-password").hide();
      this.controller.stageController.pushScene("groups", this.keychain);
    }
    else {
      $("invalid-password").show();
    }
  }
});

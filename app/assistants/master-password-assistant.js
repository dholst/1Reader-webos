MasterPasswordAssistant = Class.create(BaseAssistant, {
  initialize: function() {
    this.password = {value: ""};
  },

  setup: function($super) {
    $super();
    this.controller.setupWidget("password", {}, this.password);
    this.controller.listen("unlock", Mojo.Event.tap, this.unlock = this.unlock.bind(this));
    this.pickFile = this.pickFile.bind(this);
    this.controller.listen("try-again", Mojo.Event.tap, this.pickFile);
    this.controller.listen("pick-one", Mojo.Event.tap, this.pickFile);
    this.cookie = this.getCookie();
  },

  ready: function() {
    var location = this.cookie.get();

    if(location) {
      this.createKeychain(location);
    }
    else {
      this.showFirstTime();
    }
  },

  getCookie: function() {
    return new Mojo.Model.Cookie("keychain");
  },

  createKeychain: function(location) {
    this.showPasswordEntry();

    if(location.length > 0) {
      this.spinnerOn();

    	this.keychain = AgileKeychain.create(location, function() {
    	  this.spinnerOff();
    	  this.cookie.put(location);
    	}.bind(this));
    }
    else {
      this.hidePasswordEntry();
    }
  },

  showPasswordEntry: function() {
    $("password-entry").show();
    $("try-again").hide();
    $("first-time").hide();
  },

  hidePasswordEntry: function() {
    $("password-entry").hide();
    $("try-again").show();
    $("first-time").hide();
  },

  showFirstTime: function() {
    $("first-time").show();
  },
  
  pickFile: function() {
    var params = {
      kind: "file",
      extensions: ["html"],

      onSelect: function(response) {
        this.createKeychain(response.fullPath.substring(0, response.fullPath.indexOf("1Password.html")));
      }.bind(this)
    };

    Mojo.FilePicker.pickFile(params, this.controller.stageController);
  },

  unlock: function() {
    if(this.keychain.unlock(this.password.value)){
      $("invalid-password").hide();
      this.password.value = "";
      this.controller.modelChanged(this.password);
      this.controller.stageController.pushScene("groups", this.keychain);
    }
    else {
      $("invalid-password").show();
    }
  }
});

PickAssistant = Class.create({
  setup: function() {
    var params = {
      kind: "file",
      extensions: ["html"],
      onSelect: this.fileSelected.bind(this)
    };

    Mojo.FilePicker.pickFile(params, this.controller.stageController);
  },

  fileSelected: function(response) {
    console.log("picked " + response.fullPath);
  	this.keychainFolder = response.fullPath.substring(0, response.fullPath.indexOf("1Password.html"));
  	console.log("base folder: " + this.keychainFolder)
    this.injectScript(this.keychainFolder + "style/scripts/1PasswordAnywhere.js", this.onePasswordLoaded.bind(this));
  },

  injectScript: function(path, onLoad) {
    var script = document.createElement("script");
    script.src = path;
		script.type = "text/javascript";
		script.onload = onLoad;
		document.getElementsByTagName("head")[0].appendChild(script);
  },

  onePasswordLoaded: function() {
    console.log("1PasswordAnywhere.js loaded, creating keychain...")
    this.keychain = new Keychain();
    this.load("contents.js", this.contentsLoaded.bind(this));
  },

  contentsLoaded: function(contents) {
  	this.keychain.setContents(eval(contents));

  	this.keychain.contents[TYPE_WEBFORMS].each(function(password) {
    	console.log(password.title);
  	});
  },

  load: function(file, onSuccess) {
    file = this.keychainFolder + "data/default/" + file;
    console.log("loading " + file);

    new Ajax.Request(file, {
    	method: "get",
    	onSuccess: function(response){onSuccess(response.responseText);},
    	onFailure: function(){console.log('A problem occurred when loading the "' + file + '" file.');}
    });
  }
})
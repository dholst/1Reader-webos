OnePassword = Class.create({
  load: function(baseFolder, loaded) {
    this.baseFolder = baseFolder;
    this.callback = loaded;
    this.injectScript(this.baseFolder + "style/scripts/1PasswordAnywhere.js", this.loaded.bind(this));
  },

  loaded: function() {
    console.log("1PasswordAnywhere.js loaded, creating keychain...")
    this.keychain = new Keychain();
    this.loadFile("contents.js", this.contentsLoaded.bind(this));
  },

  contentsLoaded: function(contents) {
  	this.keychain.setContents(eval(contents));
  	this.callback();
  },

  loadFile: function(file, loaded) {
    new Ajax.Request(this.baseFolder + "data/default/" + file, {
    	method: "get",
    	onSuccess: function(response){loaded(response.responseText);},
    	onFailure: function(){console.log('A problem occurred when loading the "' + file + '" file.');}
    });
  },

  injectScript: function(path, onLoad) {
    var script = document.createElement("script");
    script.src = path;
		script.type = "text/javascript";
		script.onload = onLoad;
		document.getElementsByTagName("head")[0].appendChild(script);
  },

  groups: function() {
    var groups = [];
    groups.push(this.group(TYPE_WEBFORMS, "Logins"));
  	groups.push(this.group(TYPE_IDENTITIES, "Identities"));
  	groups.push(this.group(TYPE_NOTES, "Secure Notes"));
  	groups.push(this.group(TYPE_SOFTWARE_LICENSES, "Software"));
  	groups.push(this.group(TYPE_WALLET, "Wallet"));
  	groups.push(this.group(TYPE_PASSWORDS, "Passwords"));
  	groups.push(this.group(TYPE_TRASHED, "Trash"));
  	return groups;
  },

  group: function(key, name) {
    var group = this.keychain.contents[key];
    group.name = name;
    return group
  }
});
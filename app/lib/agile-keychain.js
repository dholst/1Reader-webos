// 1PasswordAnywhere assumes a global keychain
var keychain;

AgileKeychain = Class.create({
  unlock: function(password) {
    return keychain.verifyPassword(password);
  },

  groups: function() {
    var groups = [];
    groups.push(this._group(TYPE_WEBFORMS, "Logins"));
  	groups.push(this._group(TYPE_IDENTITIES, "Identities"));
  	groups.push(this._group(TYPE_NOTES, "Secure Notes"));
  	groups.push(this._group(TYPE_SOFTWARE_LICENSES, "Software"));
  	groups.push(this._group(TYPE_WALLET, "Wallet"));
  	groups.push(this._group(TYPE_PASSWORDS, "Passwords"));
  	groups.push(this._group(TYPE_TRASHED, "Trash"));
  	return groups;
  },

  loadItem: function(item, callback) {
    this._loadFile(item.uuid + ".1password", this._itemLoaded.bind(this, callback))
  },

  _load: function(baseFolder, loaded) {
    this.baseFolder = baseFolder;
    this.loadedCallback = loaded;
    this._injectScript(this.baseFolder + "style/scripts/1PasswordAnywhere.js", this._loaded.bind(this));
  },

  _itemLoaded: function(callback, json) {
    try {
      var item = new KeychainItem(eval("(" + json + ")"));
      item.decrypt();
      callback(item);
    }
    catch(e) {
      console.log(e.message + " " + e.line);
    }
  },

  _loaded: function() {
    console.log("1PasswordAnywhere.js loaded, creating keychain...")
    keychain = new Keychain();
    this._loadFile("encryptionKeys.js", this._encryptionKeysLoaded.bind(this));
  },

  _encryptionKeysLoaded: function(keys) {
    console.log("encryptionKeys.js loaded, loading contents...");
		keychain.setEncryptionKeys(eval("(" + keys + ")"));
    this._loadFile("contents.js", this._contentsLoaded.bind(this));
  },

  _contentsLoaded: function(contents) {
  	keychain.setContents(eval(contents));
  	this.loadedCallback();
  },

  _loadFile: function(file, loaded) {
    new Ajax.Request(this.baseFolder + "data/default/" + file, {
    	method: "get",
    	onSuccess: function(response){loaded(response.responseText);},
    	onFailure: function(){console.log('A problem occurred when loading the "' + file + '" file.');}
    });
  },

  _injectScript: function(path, onLoad) {
    console.log("injecting " + path)
    var script = document.createElement("script");
    script.src = path;
		script.type = "text/javascript";
		script.onload = onLoad;
		document.getElementsByTagName("head")[0].appendChild(script);
  },

  _group: function(key, name) {
    var group = keychain.contents[key];
    group.name = name;

    group.each(function(item) {
      item.isLogin = (item.type == TYPE_WEBFORMS)
    });

    return group
  }
});

AgileKeychain.create = function(baseFolder, callback) {
  var keychain = new AgileKeychain();
  keychain._load(baseFolder, callback);
  return keychain;
}
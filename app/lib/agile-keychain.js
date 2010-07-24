// 1PasswordAnywhere assumes a global keychain
var keychain;

AgileKeychain = Class.create({
  initialize: function(baseDirectory) {
    this.baseDirectory = baseDirectory

    if(this.baseDirectory.endsWith("/")) {
      this.baseDirectory = this.baseDirectory.substr(0, this.baseDirectory.length - 1)
    }
  },

  unlock: function(password) {
    return keychain.verifyPassword(password);
  },

  groups: function() {
    var groups = [];
    groups.push(this._group(TYPE_WEBFORMS, "Logins"));
//  	groups.push(this._group(TYPE_IDENTITIES, "Identities"));
  	groups.push(this._group(TYPE_NOTES, "Secure Notes"));
//  	groups.push(this._group(TYPE_SOFTWARE_LICENSES, "Software"));
//  	groups.push(this._group(TYPE_WALLET, "Wallet"));
//  	groups.push(this._group(TYPE_PASSWORDS, "Passwords"));
  	groups.push(this._group(TYPE_TRASHED, "Trash"));
  	return groups;
  },

  loadItem: function(item, callback) {
    this._loadFile({directory: "/data/default", name: item.uuid + ".1password"}, this._itemLoaded.bind(this, callback))
  },

  _load: function(baseDirectory, success, failure) {
    this.baseDirectory = baseDirectory
    this.loadedCallback = success
    this.failureCallback = failure
    this._injectScript(this._locationOf(AgileKeychain.ONE_PASSWORD_ANYWHERE), this._scriptLoaded.bind(this));
  },

  _scriptLoaded: function() {
    console.log("1PasswordAnywhere.js loaded, creating keychain...")
    keychain = new Keychain();
    this._loadFile(AgileKeychain.ENCRYPTION_KEYS, this._encryptionKeysLoaded.bind(this));
  },

  _locationOf: function(file) {
    return this.baseDirectory + file.directory + "/" + file.name
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

  _encryptionKeysLoaded: function(keys) {
    console.log("encryptionKeys.js loaded, loading contents...");
		keychain.setEncryptionKeys(eval("(" + keys + ")"));
    this._loadFile(AgileKeychain.CONTENTS, this._contentsLoaded.bind(this));
  },

  _contentsLoaded: function(contents) {
  	keychain.setContents(eval(contents));
  	this.loadedCallback();
  },

  _loadFile: function(file, loaded) {
    var success = function(response) {
      loaded(response.responseText)
    }

    var failure = function(response) {
      console.log('A problem occurred when loading the "' + file + '" file.')
      this.failureCallback()
    }.bind(this)

    new Ajax.Request(this.baseDirectory + file.directory + "/" + file.name, {
    	method: "get",
    	onSuccess: success,
    	onFailure: failure
    })
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
      item.isNote = (item.type == TYPE_NOTES)
    });

    return group
  },

  staticFiles: function() {
    return [
        AgileKeychain.ONE_PASSWORD_ANYWHERE,
        AgileKeychain.ENCRYPTION_KEYS,
        AgileKeychain.CONTENTS
    ]
  },

  allRawItems: function(callback) {
    new Ajax.Request(this._locationOf(AgileKeychain.CONTENTS), {
    	method: "get",
    	onSuccess: function(response) {callback(eval("(" + response.responseText + ")"))},
    	onFailure: function() {callback([])}
    })
  },

  itemLocationOf: function(id) {
    return this._locationOf({directory: "/data/default", name: id + ".1password"})
  }
})

AgileKeychain.ONE_PASSWORD_ANYWHERE = {directory: "/style/scripts", name: "1PasswordAnywhere.js"}
AgileKeychain.ENCRYPTION_KEYS = {directory: "/data/default", name: "encryptionKeys.js"}
AgileKeychain.CONTENTS = {directory: "/data/default", name: "contents.js"}

AgileKeychain.create = function(baseDirectory, success, failure) {
  new Ajax.Request(baseDirectory + AgileKeychain.ONE_PASSWORD_ANYWHERE.directory + "/" + AgileKeychain.ONE_PASSWORD_ANYWHERE.name, {
    method: 'get',

    onSuccess: function() {
      var keychain = new AgileKeychain(baseDirectory)
      keychain._load(baseDirectory, success.bind(this, keychain), failure)
    },

    onFailure: failure
  })
}
var DropboxFolderSelectAssistant = Class.create(BaseAssistant, {
  initialize: function() {
    this.folders = {items: []}
    this.paths = []
  },

  setup: function($super) {
    $super()

    var listAttributes = {
      listTemplate: "dropbox/folders",
      itemTemplate: "dropbox/folder"
    }

    this.controller.setupWidget('folders', listAttributes, this.folders)
    this.controller.listen("folders", Mojo.Event.listTap, this.folderTapped = this.folderTapped.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("folders", Mojo.Event.listTap, this.folderTapped)
  },

  activate: function() {
    this.accessToken = Preferences.getDropboxAccessToken()

    if(this.accessToken == null) {
      this.authenticate()
    }
    else {
      this.showSpinner()
      Dropbox.checkAccessToken(this.accessToken, this.showFolders.bind(this, '/'), this.authenticate.bind(this))
    }
  },

  folderTapped: function(event) {
    if(event.item.name == '1Password.agilekeychain') {
      Preferences.setDropboxLocation(event.item.path)
      this.controller.stageController.popScene()
    }
    else {
      this.showFolders(event.item.path)
    }
  },

  showFolders: function(path) {
    this.showSpinner()
    this.paths.push(path)
    this.showPaths()
    Dropbox.folderList(this.accessToken, path, this.foldersRetrieved.bind(this), this.foldersRetrievalError.bind(this))
  },

  showPaths: function() {
    this.paths.each(function(path) {
      console.log(path)
    })
  },
  
  showSpinner: function() {
    this.spinnerOn("getting dropbox folders")
  },

  foldersRetrieved: function(folders) {
    this.spinnerOff()
    this.folders.items.clear()
    this.folders.items.push.apply(this.folders.items, folders);
    this.controller.modelChanged(this.folders);
  },

  foldersRetrievalError: function() {
    this.controller.popScene()
  },

  authenticate: function() {
    this.controller.stageController.swapScene('dropbox-authentication')
  },

  handleCommand: function(event) {
    if(Mojo.Event.back === event.type && this.paths.length > 1) {
      this.paths.pop()
      this.showFolders(this.paths.pop())
      event.stop();
    }
  }
})
var DropboxFolderSelectAssistant = Class.create(BaseDropboxAssistant, {
  initialize: function() {
    this.folders = {items: []}
    this.paths = []
    this.sceneName = 'dropbox-folder-select'
    this.whenAuthenticated = this.showFolders.bind(this, '/')
  },

  setup: function($super) {
    $super()
    this.controller.setupWidget('folders', {listTemplate: "dropbox/folders", itemTemplate: "dropbox/folder"}, this.folders)
    this.controller.listen("folders", Mojo.Event.listTap, this.folderTapped = this.folderTapped.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("folders", Mojo.Event.listTap, this.folderTapped)
  },

  folderTapped: function(event) {
    if(event.item.name.endsWith('.agilekeychain')) {
      Preferences.setDropboxLocation(event.item.path)
      this.controller.stageController.popScene()
    }
    else {
      this.showFolders(event.item.path)
    }
  },

  showFolders: function(path) {
    this.spinnerOn("getting dropbox folders")
    this.paths.push(path)
    Dropbox.folderList(this.accessToken, path, this.foldersRetrieved.bind(this), this.foldersRetrievalError.bind(this))
  },

  foldersRetrieved: function(folders) {
    this.spinnerOff()
    this.folders.items.clear()
    this.folders.items.push.apply(this.folders.items, folders);
    this.controller.modelChanged(this.folders);
  },

  foldersRetrievalError: function() {
    this.controller.stageController.swapScene("bail", "Error retrieving dropbox folders")
  },

  handleCommand: function(event) {
    if(Mojo.Event.back === event.type && this.paths.length > 1) {
      this.paths.pop()
      this.showFolders(this.paths.pop())
      event.stop();
    }
  }
})
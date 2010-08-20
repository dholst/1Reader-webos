var DropboxSyncAssistant = Class.create(BaseDropboxAssistant, {
  initialize: function() {
    this.dropboxPath = Preferences.getDropboxLocation()
    this.localPath = Preferences.getKeychainLocation()
    this.localKeychain = new AgileKeychain(this.localPath)
    this.sceneName = 'dropbox-sync'
    this.whenAuthenticated = this.sync.bind(this)
    this.staticFiles = this.localKeychain.staticFiles()
    this.totalStaticFiles = this.staticFiles.length
  },

  sync: function() {
    this.progress = {value: 0};
    this.controller.setupWidget("progress", {}, this.progress);
    this.spinnerOn("syncing...")
    $("spinner-message").insert({after: '<div id="progress-container"><div style="width: 65%; margin: auto;" id="progress" x-mojo-element="ProgressBar"></div></div>'});
    this.controller.instantiateChildWidgets($("progress-container"));
    this.localKeychain.allRawItems(this.gotOldItems.bind(this))
  },

  gotOldItems: function(items) {
    this.oldItems = items
    this.syncNextStaticFile()
  },

  syncNextStaticFile: function() {
    var file = this.staticFiles[0]
    var url = Dropbox.downloadUrlFor(this.accessToken, this.dropboxPath + file.directory + "/" + file.name)
    console.log(url)
    DownloadManager.download(url, this.localPath + file.directory, file.name, this.staticFileSynced.bind(this), this.syncError.bind(this))
  },

  staticFileSynced: function() {
    this.staticFiles = this.staticFiles.slice(1)
    this.progress.value = (this.totalStaticFiles - this.staticFiles.length) / this.totalStaticFiles
    this.controller.modelChanged(this.progress)

    if(this.staticFiles.length) {
      this.syncNextStaticFile()()
    }
    else {
      this.syncContents()
    }
  },

  syncContents: function() {
    this.localKeychain.allRawItems(this.gotNewItems.bind(this))
  },

  gotNewItems: function(items) {
    this.newItems = items

    var lastItemSyncedAt = 0

    this.oldItems.each(function(item) {
      if(item[4] > lastItemSyncedAt) {
        lastItemSyncedAt = item[4]
      }
    })

    this.syncNextItem(0, lastItemSyncedAt)
  },

  syncNextItem: function(index, lastSyncedAt) {
    this.progress.value = index / this.newItems.length
    this.controller.modelChanged(this.progress)

    if(index >= this.newItems.length) {
      this.controller.stageController.popScene()
      return
    }

    if(this.newItems[index][4] > lastSyncedAt) {
      this.syncItem(index, lastSyncedAt)
    }
    else {
      new Ajax.Request(this.localKeychain.itemLocationOf(this.newItems[index][0]), {
        method: 'get',
        onSuccess: this.syncNextItem.bind(this, index + 1, lastSyncedAt),
        onFailure: this.syncItem.bind(this, index, lastSyncedAt)
      })
    }
  },

  syncItem: function(index, lastSyncedAt) {
    var filename = this.newItems[index][0] + ".1password"
    var url = Dropbox.downloadUrlFor(this.accessToken, this.dropboxPath + "/data/default/" + filename)

    DownloadManager.download(
        url,
        this.localPath + "/data/default/",
        filename,
        this.syncNextItem.bind(this, index + 1, lastSyncedAt),
        this.syncError.bind(this)
    )
  },

  syncError: function() {
    this.controller.stageController.swapScene("bail", "Error performing sync")
  }
})
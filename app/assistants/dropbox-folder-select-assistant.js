var DropboxFolderSelectAssistant = Class.create(BaseAssistant, {
  setup: function() {
    this.controller.stageController.pushScene('dropbox-authentication')
  }
})
var NotFoundAssistant = Class.create(BaseAssistant, {
  initialize: function(killLoop) {
    this.killLoop = killLoop
    this.allowPreferences = true    
  },

  activate: function() {
    if(this.killLoop) {
      this.killLoop = false
    }
    else {
      this.controller.stageController.swapScene('load')
    }
  }
})
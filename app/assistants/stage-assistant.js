StageAssistant = Class.create({
  setup: function() {
    OneReader.Metrix.postDeviceData()
    Mojo.Event.listen(document, Mojo.Event.tap, this.documentTapped = this.documentTapped.bind(this));
    this.controller.pushScene("load");
  },

  documentTapped: function(event) {
    if(event.target && event.target.hasClassName("copyable")) {
      var stack = this.controller.getScenes();
      var scene = stack[stack.size() - 1];

      scene.assistant.controller.popupSubmenu({
        onChoose: this.copy.bind(this, event.target),
        placeNear: event.target,
        items: [{label: "Copy", command: "copy"}]
      });
    }
  },

  copy: function(element, command) {
    if("copy" === command) {
      this.controller.setClipboard(element.innerHTML);
    }
  }
});

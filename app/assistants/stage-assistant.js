StageAssistant = Class.create({
  setup: function() {
    Mojo.Event.listen(document, Mojo.Event.tap, this.copy.bind(this));
    this.controller.pushScene("pick");
  },

  copy: function(event) {
    if(event.target && event.target.hasClassName("copyable")) {
      console.log("COPYING " + event.target.innerHTML + " TO CLIPBOARD")
    }
  }
});

NoteItemAssistant = Class.create(ItemAssistant, {
  itemLoaded: function(item) {
    item.notes = item.decrypted_secure_contents.notesPlain;
    this.controller.update("item-container", Mojo.View.render({object: item, template: "note-item/note-item"}));
  }
});
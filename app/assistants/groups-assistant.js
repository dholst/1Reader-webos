GroupsAssistant = Class.create(BaseAssistant, {
  initialize: function(keychain) {
    this.keychain = keychain
    this.types = {items: this.keychain.groups()}
    this.search = {value: ""}
    this.searchResults = {items: []}
  },

  setup: function($super) {
    $super()
    this.controller.setupWidget("groups", {itemTemplate: "groups/group"}, this.types)
    this.controller.setupWidget("search", {hintText: "Search...", changeOnKeyPress: true, focus: true, textCase: Mojo.Widget.steModeLowerCase}, this.search)
    this.controller.setupWidget("search-results", {itemTemplate: "groups/search"}, this.searchResults)
    this.controller.listen("groups", Mojo.Event.listTap, this.groupTapped = this.groupTapped.bind(this))
    this.controller.listen("search", Mojo.Event.propertyChange, this.searchEntry = this.searchEntry.bind(this));
    this.controller.listen("search-results", Mojo.Event.listTap, this.searchResultTapped = this.searchResultTapped.bind(this))
  },

  activate: function() {
    this.controller.get("search").mojo.focus()
  },

  searchEntry: function() {
    this.searchResults.items.clear()

    if(this.search.value.length) {
      for(var i = 0; i < this.types.items.length; i++) {
        var group = this.types.items[i]

        for(var j = 0; j < group.length; j++) {
          var item = group[j]

          if(this.searchResults.items.length < 20 && item.title.toLowerCase().include(this.search.value.toLowerCase())) {
            this.searchResults.items.push(item)
          }
        }
      }
    }

    if(this.searchResults.items.length) {
      this.controller.modelChanged(this.searchResults)
      this.showSearch()
    }
    else {
      this.hideSearch()
    }
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("groups", Mojo.Event.listTap, this.groupTapped)
    this.controller.stopListening("search", Mojo.Event.propertyChange, this.searchEntry)
    this.controller.stopListening("search-results", Mojo.Event.listTap, this.searchResultTapped)
  },

  groupTapped: function(event) {
    this.controller.stageController.pushScene("items", this.keychain, event.item)
  },

  searchResultTapped: function(event) {
    //this.hideSearch()
    this.controller.stageController.pushScene(ItemSceneFactory.get(event.item), this.keychain, event.item)
  },

  handleCommand: function($super, event) {
    if(event.type == Mojo.Event.back) {
      if(this.showingSearch) {
        this.hideSearch()
        event.stop()
      }
      else {
        this.controller.stageController.swapScene("locked")
        event.stop()
      }
    }
    else {
      $super(event)
    }
  },

  showSearch: function() {
    this.showingSearch = true
    this.controller.get("search-results").show()
  },

  hideSearch: function() {
    this.showingSearch = false
    this.controller.get("search-results").hide()
  }
})

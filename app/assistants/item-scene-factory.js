ItemSceneFactory = {
  get: function(item) {
    if(item.isLogin) {
      return "login-item"
    }
    
    if(item.isNote) {
      return "note-item"
    }
    
    return "unknown-item"
  }
}
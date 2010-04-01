ItemSceneFactory = {
  get: function(item) {
    if(item.isLogin) {
      return "login-item";
    }
    
    return "unknown-item";
  }
}
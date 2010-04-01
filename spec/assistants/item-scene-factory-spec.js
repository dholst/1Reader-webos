describe("ItemSceneFactory", function() {
  var item;
  
  beforeEach(function() {
    item = {};
  });
  
  it("should return unknown scene", function() {
    expect(ItemSceneFactory.get(item)).toEqual("unknown-item");
  })
  
  it("should return login scene", function() {
    item.isLogin = true;
    expect(ItemSceneFactory.get(item)).toEqual("login-item");
  })
});

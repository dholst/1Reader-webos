var Dropbox = {
  getAccessTokenFor: function(username, password, success, failure) {
    var message = {
      method: 'GET',
      action: 'https://api.getdropbox.com/0/token',
      parameters: {
        email: username,
        password: password,
        oauth_consumer_key: DropboxConsumerToken.key
      }
    }

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, {consumerSecret: DropboxConsumerToken.secret});

    new Ajax.Request(OAuth.addToURL(message.action, message.parameters), {
      method: message.method,
      onSuccess: function(response){success(response.responseJSON)},
      onFailure: function(response){failure()}
    })
  }
}
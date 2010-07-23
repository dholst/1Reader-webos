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

    var onSuccess = function(response) {
      var token = eval('(' + response.responseText + ')')
      token.key = token.token
      success(token)
    }

    this.sendRequest(message, this.secrets(), onSuccess, failure)
  },

  checkAccessToken: function(accessToken, success, failure) {
    var message = {
      method: 'GET',
      action: 'https://api.getdropbox.com/0/account/info',
      parameters: {
        oauth_token: accessToken.key,
        oauth_consumer_key: DropboxConsumerToken.key
      }
    }

    this.sendRequest(message, this.secrets(accessToken.secret), success, failure)
  },

  folderList: function(accessToken, path, success, failure) {
    var message = {
      method: 'GET',
      action: 'https://api.getdropbox.com/0/metadata/dropbox' + encodeURIComponent(path).replace(/%2f/gi, '/'),
      parameters: {
        oauth_token: accessToken.key,
        oauth_consumer_key: DropboxConsumerToken.key
      }
    }

    this.sendRequest(message, this.secrets(accessToken.secret), this.sendFoldersResponse.bind(this, success), failure)
  },

  sendFoldersResponse: function(callback, response) {
    var json = eval('(' + response.responseText + ')')
    var folders = []

    json.contents.each(function(folder) {
      if(folder.is_dir) {
        folder.name = folder.path.substring(folder.path.lastIndexOf('/') + 1)
        folders.push(folder)
      }
    })

    callback(folders)
  },

  secrets: function(accessTokenSecret) {
    var secrets = {consumerSecret: DropboxConsumerToken.secret}

    if(accessTokenSecret) {
      secrets.tokenSecret = accessTokenSecret
    }

    return secrets
  },

  sendRequest: function(message, secrets, success, failure) {
    OAuth.setTimestampAndNonce(message)
    OAuth.SignatureMethod.sign(message, secrets)

    new Ajax.Request(OAuth.addToURL(message.action, message.parameters), {
      method: message.method,
      onSuccess: success,
      onFailure: failure
    })
  }
}
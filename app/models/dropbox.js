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

  downloadUrlFor: function(accessToken, path) {
    var message = {
      method: 'GET',
      action: 'https://api-content.dropbox.com/0/files/dropbox' + encodeURIComponent(path).replace(/%2f/gi, '/'),
      parameters: {
        oauth_token: accessToken.key,
        oauth_consumer_key: DropboxConsumerToken.key
      }
    }

    return this.urlFor(message, this.secrets(accessToken.secret))
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

  urlFor: function(message, secrets) {
    OAuth.setTimestampAndNonce(message)
    OAuth.SignatureMethod.sign(message, secrets)
    return OAuth.addToURL(message.action, message.parameters)
  },

  sendRequest: function(message, secrets, success, failure) {
    if(this.requestInProgress) {
      failure()
    }
    else {
      this.requestInProgress = true
      new Ajax.Request(this.urlFor(message, secrets), {
        method: message.method,
        onSuccess: function(response) {this.requestInProgress = false; success(response)}.bind(this),
        onFailure: function(response) {this.requestInProgress = false; failure(response)}.bind(this)
      })
    }
  }
}
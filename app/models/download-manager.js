var DownloadManager = {
  requestUrl: "palm://com.palm.downloadmanager/",
  requestId: 0,
  requests: {},

  download: function(url, targetDirectory, fileName, onComplete, onFailure) {
    var requestId = this.requestId++

    this.requests[requestId] = new Mojo.Service.Request(DownloadManager.requestUrl, {
      method: "download",
      onSuccess: this.onDownloadSuccess.bind(this, requestId, onComplete, onFailure),
      onFailure: this.onDownloadFailure.bind(this, requestId, onFailure),
      parameters: {
        target: url,
        targetDir : targetDirectory,
        subscribe: true,
        targetFilename: fileName
      }
    })
  },

  onDownloadSuccess: function(requestId, onComplete, onFailure, response) {
    Mojo.Log.info("download success:", Object.toJSON(response))

    if(response.completionStatusCode) {
      delete this.requests[requestId]

      if(response.completionStatusCode && response.completionStatusCode != 200) {
        onFailure()
      }
      else {
        onComplete(response.target)
      }
    }
  },

  onDownloadFailure: function(requestId, onFailure, response) {
    Mojo.Log.error("download onError:", Object.toJSON(response))
    delete this.requests[requestId]
    onFailure()
  }
}

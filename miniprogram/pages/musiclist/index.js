// miniprogram/pages/musiclist/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playlistId: null,
    musiclist: [],
    musicBanner: null,
    musicTitle: null,
    listInfo: {},
    currentId: 0
  },
  
  onLoad: function (options) {
    this._getMusicList(options.playlistId)
  },
  // 获取音乐列表
  async _getMusicList(playlistId) {
    let response = await wx.cloud.callFunction({
      name: "music",
      data: {
        $url: "musiclist",
        playlistId
      }
    })
    let playlist = JSON.parse(response.result).playlist

    this.setData({
      musiclist: playlist.tracks,
      "listInfo.imgUrl":playlist.coverImgUrl,
      "listInfo.name":playlist.name,
    })
    console.log("获取歌单列表", this.data.musiclist)
    wx.setStorage({
      key: "musicList",
      data: JSON.stringify(
        this.data.musiclist
      )
    })
  }
})
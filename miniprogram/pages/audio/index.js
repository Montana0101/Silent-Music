// miniprogram/pages/player/index.js
let Manager = wx.getBackgroundAudioManager(); //音乐播放实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    audioUrl: "",
    musicList: [],
    cutMusic: {},
    cutIndex: 0,
    flag: false, // 控制播放开关，或者false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      musicId,
      musicName,
      musicIndex
    } = options
    this._getMusicAudio(musicId, musicName)
    wx.setNavigationBarTitle({
      title: musicName,
    })
    // 获取歌单所有数据
    wx.getStorage({
      key: 'musicList',
    }).then(res => {
      this.setData({
        musicList: JSON.parse(res.data),
        cutMusic: JSON.parse(res.data)[musicIndex],
        cutIndex: musicIndex
      })
    })
  },

  onReady:function(){
    // console.log("progress is",this.selectComponent("#progress"))
  },

  // 获取音频
  async _getMusicAudio(musicAudioId, musicName) {
    let {
      result
    } = await wx.cloud.callFunction({
      name: "music",
      data: {
        $url: "musicAudio",
        musicAudioId
      }
    })
    let cutData = JSON.parse(result).data[0]
    this.setData({
      audioUrl: cutData.url
    })
    Manager.title = musicName,
      Manager.src = cutData.url
  },

  // 控制暂停或播放
  playOrPause() {
    // flag开关false时正常播放，true时暂停
    this.setData({
      flag: !this.data.flag
    }, () => {
      if (this.data.flag) {
        Manager.pause()
      } else if (!this.data.flag) {
        Manager.play()
      }
    })
  },

  // 上一首
  toPrev() {
    let num = this.data.cutIndex
    num = num - 1
    if (num < 0) {
      num = this.data.musicList.length - 1
    }
    this.setData({
      cutIndex: num,
      cutMusic: this.data.musicList[num]
    }, () => {
      this._getMusicAudio(this.data.cutMusic.id, this.data.cutMusic.name)
      this.selectComponent("#progress")._getPlayTime()
    })
  },

  // 下一首
  toNext() {
    let num = this.data.cutIndex
    num = num + 1
    if (num > this.data.musicList.length - 1) {
      num = 0
    }
    this.setData({
      cutIndex: num,
      cutMusic: this.data.musicList[num]
    }, () => {
      this._getMusicAudio(this.data.cutMusic.id, this.data.cutMusic.name)
      this.selectComponent("#progress")._getPlayTime()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
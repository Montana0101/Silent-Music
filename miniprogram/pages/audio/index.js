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
    action: "", // 判断是历史记录进的还是正常页面进的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      musicIndex,
      action,
      musicDetail
    } = options
    this._getMusicAudio(musicDetail, false)

    // 获取歌单所有数据
    if (action != "history") {
      wx.getStorage({
        key: 'musicList',
      }).then(res => {
        this.setData({
          musicList: JSON.parse(res.data),
          cutMusic: JSON.parse(res.data)[musicIndex],
          cutIndex: musicIndex,
          action: action
        })
      })
    } else {
      wx.getStorage({
        key: 'historyList',
      }).then(res => {
        this.setData({
          musicList: JSON.parse(res.data),
          cutMusic: JSON.parse(res.data)[musicIndex],
          cutIndex: musicIndex,
          action: action
        })
      })
    }

  },

  // 获取音频
  async _getMusicAudio(musicDetail, flag) {
    if (!flag) {
      musicDetail = JSON.parse(decodeURIComponent(musicDetail))
    }
    let {
      result
    } = await wx.cloud.callFunction({
      name: "music",
      data: {
        $url: "musicAudio",
        musicAudioId: musicDetail.id
      }
    })

    let cutData = JSON.parse(result).data[0]
    this.setData({
      audioUrl: cutData.url
    })

    if (this.data.action != "history") {
      // 存储成为历史数据
      wx.getStorage({
        key: 'historyList',
      }).then(res => {
        let historyList = JSON.parse(res.data)

        // 只允许存储77条数据
        if (historyList.length < 77) {
          historyList.map((item, index) => {
            if (item.id == musicDetail.id) {
              historyList.splice(index, 1)
            }
          })
          historyList.push(musicDetail)
        } else {
          historyList.shift()
        }
        wx.setStorage({
          data: JSON.stringify(historyList),
          key: 'historyList',
        })
      }).catch(err => {
        wx.setStorage({
          data: JSON.stringify([musicDetail]),
          key: "historyList",
        })
      })
    }

    Manager.title = musicDetail.name,
    Manager.src = cutData.url
    Manager.singer = musicDetail.ar[0].name
    Manager.coverImgUrl = musicDetail.al.picUrl

    // 动态设置标题
    wx.setNavigationBarTitle({
      title: musicDetail.name,
    })
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
      flag: false,
      cutIndex: num,
      cutMusic: this.data.musicList[num]
    }, () => {
      this._getMusicAudio(this.data.cutMusic, true)
      this.selectComponent("#progress")._getPlayTime()
    })
  },

  // 下一首
  toNext() {
    let num = this.data.cutIndex
    num++
    if (num > this.data.musicList.length - 1) {
      num = 0
    }
    this.setData({
      flag: false,
      cutIndex: num,
      cutMusic: this.data.musicList[num]
    }, () => {
      this._getMusicAudio(this.data.cutMusic, true)
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
// pages/playlist/playlist.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerArr: [],
    playList: [],
    start: 0, // 开始位置
    count: 12, // 返回条数
    flag: false, // 判断是否还有返回数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this._getBanner()
    this._getPlayList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    // 开关开着代表还有数据没拉
    this._testInterface()
    if (this.data.flag) {
      this.setData({
        start: this.data.start + 1
      }, () => {
        this._getPlayList()
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 获取banner图
  async _getBanner(){
    let response = await wx.cloud.callFunction({
      name: "music",
      data: {
        $url:"banner"
      }
    })
    this.setData({
      bannerArr:response.result.data
    })
  },

  // 获取歌单列表
  async _getPlayList() {
    let musicData = await wx.cloud.callFunction({
      name: "music",
      data: {
        $url: "playlist",
        start: this.data.start * this.data.count,
        count: this.data.count,
      }
    })
    if (musicData.result.data.length > 0) {
      this.setData({
        flag: true,
        playList: this.data.playList.concat(musicData.result.data)
      })

    } else {
      this.setData({
        flag: false
      })
    }
  },

  // 测试接口哈哈哈
  _testInterface(){

  }
})
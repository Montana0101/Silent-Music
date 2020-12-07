// miniprogram/pages/musiclist/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     playlistId:null,
     musiclist:[],
     musicBanner:null,
     musicTitle:null,
     listInfo:{},
     currentId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //  console.log("获取当前路由参数",options)
       this._getMusicList(options.playlistId)
  },

  // 获取音乐列表
  async _getMusicList(playlistId){
    let response = await wx.cloud.callFunction({
      name: "music",
      data: {
        $url:"musiclist",
        playlistId
      }
    })
    let playlist = JSON.parse(response.result).playlist
    
    this.setData({
      musiclist:playlist.tracks,
      listInfo:{
        imgUrl:playlist.coverImgUrl,
        name:playlist.name
      }
    })
    console.log("获取歌单列表",this.data.musiclist)
    wx.setStorage({
      key:"musicList",
      data:JSON.stringify(
        this.data.musiclist
      )
    })
  },

  // 选中音乐
  _selectMusic(e){
      let {musicid,musicname,index} = e.currentTarget.dataset
      this.setData({
        currentId:musicid
      })
      wx.navigateTo({
        url: `/pages/audio/index?musicId=${musicid}&musicName=${musicname}&musicIndex=${index}`,
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    progressAreaWidth: 0,
    progressViewWidth: 0,
    currentTime: "00:00",
    totalTime: "00:00",
    pert:0
  },

  lifetimes: {
    attached() {
      this._getPlayTime()
    },
    ready() {
      // 获取屏幕进度条宽度
      this._getProgressWidth()

      // 获取事件流
      this._getAudioEvent()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化获取播放时间
    _getPlayTime() {
      let totalTime = wx.getBackgroundAudioManager().duration
      if (typeof totalTime == "undefined") {
        setTimeout(() => {
          let timer = this._parseTime(wx.getBackgroundAudioManager().duration)
          // console.log("获取timer111",timer)
          this.setData({
            totalTime: timer
          })
        }, 1500)
      } else {
        let timer = this._parseTime(totalTime)
        // console.log("获取timer222",timer)
        this.setData({
          totalTime: timer
        })
      }
    },

    // 时间转换
    _parseTime(time) {
      let min = Math.floor(time / 60)
      let sec = Math.floor(time % 60)
      min = min < 10 ? "0" + min : min
      sec = sec < 10 ? "0" + sec : sec
      return min + ":" + sec
    },

    // 获取进度条宽度
    _getProgressWidth() {
      let query = this.createSelectorQuery()
      // 获取不同机型进度条宽度
      query.select(".movable-area").boundingClientRect()
      query.select(".movable-view").boundingClientRect()
      query.exec(item => {
        this.setData({
          progressAreaWidth: item[0].width,
          progressViewWidth: item[1].width
        }, () => {
          console.log("获取宽度1", this.data.progressAreaWidth, this.data.progressViewWidth)
        })
      })
    },

    // 音频事件流
    _getAudioEvent() {
      wx.getBackgroundAudioManager().onCanplay(() => {
        console.log(" onCanplay , 监听背景音频进入可播放状态事件。 但不保证后面可以流畅播放")
      })

      wx.getBackgroundAudioManager().onEnded(() => {
        console.log("onEnded --- 监听背景音频自然播放结束事件")
      })

      wx.getBackgroundAudioManager().onStop(() => {
        console.log("onStop --- 监听背景音频停止事件")
      })

      wx.getBackgroundAudioManager().onTimeUpdate(() => {
        // console.log("onTimeUpdate ---   监听背景音频播放进度更新事件， 只有小程序在前台时会回调。")
        let currentTime = wx.getBackgroundAudioManager().currentTime
        let totalTime = wx.getBackgroundAudioManager().duration
        let pert = currentTime / totalTime * 100 
        pert = pert.toFixed(2)
        this.setData({
          pert
        })
        // console.log('百分比是',pert)
      })
    }
  }
})
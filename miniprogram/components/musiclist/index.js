// components/musiclist/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cutObj: {
      type: Object
    },
    index: {
      type: Number
    },
    action:{
      type:String
    }
  },

  lifetimes:{
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentId: null,
    cutInx:null
  },

  methods: {
    // 选中音乐
    _selectMusic(e) {
      let {
        musicid,
        index,
        detail
      } = e.currentTarget.dataset
      wx.setStorage({
        data: index,
        key: 'musicIndex',
      })

      // 获取当前Index
      this.setData({
        currentId: musicid,
        cutInx:index
      })
      
      // 判断是正常播放还是历史记录进的
      let _action = this.properties.action=="history" ? 'history' : "play"
      detail = encodeURIComponent(JSON.stringify(detail))
      wx.navigateTo({
        url: `/pages/audio/index?action=${_action}&musicId=${musicid}&musicIndex=${index}&musicDetail=${detail}`,
      })
    },
  }
})
// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     list:{
       type:Object
     }
  },
  lifetimes:{
     attached(){
      //  console.log("数据是",this.properties.list)
     }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count:0 
  },

  observers:{
     ["list.playCount"](val){
      val && this.formatNumber(val)
     }
  },

  /**
   * 组件的方法列表
   */
  methods: {
     // 格式化数字
     formatNumber(number){
       if(number.toString().length>4){
         this.setData({
           count:(number/10000).toFixed(2)+"万"
         })
       }else if(number.toString().length<=4){
         this.setData({
           count:number
         })
       } 
     },

     // 获取音乐列表
     _getMusicList(event){
          // console.log("获取音乐列表ID",event.currentTarget.dataset.playlistid)
          wx.navigateTo({
            url: `/pages/musiclist/index?playlistId=${event.currentTarget.dataset.playlistid}`,
          })
     }
  }
})

// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require("request-promise")

cloud.init()
const db = cloud.database();
let api_base_url = 
"https://montana-3gqbbc3ma95c3966-1258502339.ap-shanghai.service.tcloudbase.com/container-music-resource-node"

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let currentData = []
  rp(`${api_base_url}/top/playlist/highquality`).then(res => {
    // console.log("获取真实的数据", JSON.parse(res).playlists)
    currentData = JSON.parse(res).playlists
  })

  let {
    data = []
  } = await db.collection("playlist").get()

  // 新增数据 去重
  currentData.map((item1) => {
    let flag = true
    // 初始化添加数据
    if (data.length === 0) {
      db.collection("playlist").add({
        data: {
          ...item1,
          createTime: db.serverDate()
        }
      })
    } else {
      data.map((item2) => {
        if (item2.id === item1.id) {
          flag = false
        }
      })
      if (flag) {
        db.collection("playlist").add({
          data: {
            ...item1,
            createTime: db.serverDate()
          }
        })
      }
    }
  })


  // 删除数据
  // let removeRes = await db.collection("playlist").where({
  //   canDislike: true
  // }).remove()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
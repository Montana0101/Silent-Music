// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require("request-promise")

cloud.init()
const db = cloud.database();
let api_base_url = "https://montana-3gqbbc3ma95c3966-1258502339.ap-shanghai.service.tcloudbase.com/container-music-resource-node"

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 删除数据
  db.collection("banner").where({
    event: null
  }).remove()

  request(`${api_base_url}/banner`).then(res => {
    JSON.parse(res).banners.map(item => {
      db.collection("banner").add({
        data: {
          ...item
        }
      })
    })
  })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
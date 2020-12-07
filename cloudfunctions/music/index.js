// 云函数入口文件
const cloud = require('wx-server-sdk')
const Router = require("tcb-router")
const request = require("request-promise")
cloud.init()

let BASE_URL =
  "https://montana-3gqbbc3ma95c3966-1258502339.ap-shanghai.service.tcloudbase.com/container-music-resource-node"

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new Router({
    event
  })
  app.router('playlist', async (ctx, next) => {
    let musicList = await db.collection("playlist")
      .skip(event.start).limit(event.count)
      .orderBy("createTime", "desc").get()
    ctx.body = musicList
  })
  app.router('banner', async (ctx, next) => {
    let bannerList = await db.collection('banner').get()
    ctx.body = bannerList
  })
  app.router("musiclist", async (ctx, next) => {
    let musiclist = await request(`${BASE_URL}/playlist/detail?id=${event.playlistId}`)
    ctx.body = musiclist
  })
  // 获取音乐播放
  app.router("musicAudio", async (ctx, next) => {
    let musicAudio = await request(`${BASE_URL}/song/url?id=${event.musicAudioId}`)
    ctx.body = musicAudio
  })
  return app.serve()
}
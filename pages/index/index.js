//index.js
import {host,hostObj,state} from "./../../config.js"
//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    gameInfo: {},
    openid: 0
  },
  onLoad: function () {
    let that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              that.setData({
                userInfo:{
                  name: res.userInfo.nickName,
                  avatar: res.userInfo.avatarUrl
                },
                hasUserInfo: true
              })
            }
          })
        }
      }
    })
    this.getAuth()
  },
  getAuth: function(){
    let that = this
    wx.login({
      success: (res) =>{
        wx.request({
          url: hostObj.auth + "code="+ res.code + '&state=' + state,
          method: 'GET',
          success: (res)=>{
            that.setData({
              openid: res.data.data.result.openid
            })
            wx.setStorage({
              key: "userInfo",
              data: {
                userId : res.data.data.result.openid,
                // userId : that.data.openid + new Date().getTime(),
                name: that.data.userInfo.name,
                avatar: that.data.userInfo.avatar
              }
            })
            that.getGameInfo(res.data.data.result.openid)
          }
        })
      }
    })
  },
  //获取对战信息
  getGameInfo: function(id){
    let that = this
    wx.request({
      url: hostObj.record + "uid=" + id,
      method: 'GET',
      success: (res)=>{
        if(res.data.data){
          let winP = ((res.data.data.win_times / res.data.data.times) * 100).toFixed(0) + '%'
          res.data.data.winP = winP
        }else{
          res.data.data = {
            times: 0,
            win_times: 0,
            winP: '0%'
          }
        }
        that.setData({
          gameInfo: res.data.data
        })
      }
    })
  },
  playGame: function(){

  },
  getUserInfo: function(e) {
    let that = this
    let userInfo = e.detail.userInfo
    that.setData({
      userInfo:{
        name: userInfo.nickName,
        avatar: userInfo.avatarUrl
      },
      hasUserInfo: true
    })
    wx.setStorage({
      key: "userInfo",
      data: {
        userId : that.data.openid,
        // userId : that.data.openid + new Date().getTime(),
        name: userInfo.nickName,
        avatar: userInfo.avatarUrl
      }
    })
  },
  getUserInfoAgain: function(e){
    let that = this
    let userInfo = e.detail.userInfo
    wx.setStorage({
      key: "userInfo",
      data: {
        userId : that.data.openid,
        // userId : that.data.openid + new Date().getTime(),
        name: userInfo.nickName,
        avatar: userInfo.avatarUrl
      }
    })
    wx.navigateTo({
      url: './../../pages/pk/pk'
    })
  }
})

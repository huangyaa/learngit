//app.js
const AV = require('./pages/libs/av-weapp-min.js')
AV.init({
  appId: 'dIGXCqHaQEGENfH7A3tBYPl7-gzGzoHsz',
  appKey: 'XXPnbOUsbGFEnkBUy0GXMMwT',
})
const user = AV.User.current();
App({
  onLaunch: function () {
    var that = this
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    AV.User.loginWithWeapp().then(user => {
      that.globalData.userLC = user.toJSON();
    }).catch(console.error);
  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
              user.set(res.userInfo).save().then(user => {
                // 成功，此时可在控制台中看到更新后的用户信息
                that.globalData.userLC = user.toJSON();
              }).catch(console.error);
            }
          })
        }
      });
    }
  },
  globalData:{
    userLC:null,
    userInfo:null
  }
})
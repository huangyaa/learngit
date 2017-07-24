
const AV = require('../libs/av-weapp-min.js');
const query = new AV.Query('student');
Page({
  data: {
    // text:"这是一个页面"
    userName:'',
    list: [],
    hasRefesh:true,
    page: 1,
    size: 20,
    count: 0,
    countindex: 0
  },

  onLoad: function (options) {
  
  },

  // onReady: function () {
  //   // 页面渲染完成
  // },
  
   onShow: function () {
     // 页面显示
     var that = this;
     //数据数目
     query.count().then(function (count) {
       that.setData({ count });
       console.log(count);
     }, function (error) {
       wx.showToast({
         title: '查询失败',
         icon: 'loading',
         duration: 2000,
       })
     });
     //数据加载
     query.limit(10);
     query.descending('createdAt')
       .find()
       .then(list => that.setData({ list })
       ).catch(console.error);
     that.setData({
       hasRefesh:false
     });
     console.log(that.data.list);
   },
  // onHide: function () {
  //   // 页面隐藏
  // },
  // onUnload: function () {
  //   // 页面关闭
  // },
  //列表项事件处理函数
  bindViewTap: function (e) {
    console.log(e.currentTarget.dataset.title);
    //跳转到详情页面
    wx.navigateTo({
      url: '../detailStudent/detailStudent?id=' + e.currentTarget.dataset.title
    })
  },
//滚动到底部触发
  loadMore: function (e) {
    //判断是否还有数据需要加载
    var indexnum = that.data.countindex;
    that.setData({ countindex: indexnum + 1 });
    if ((indexnum + 1) * 10 > that.data.count) {
      wx.showToast({
        title: '没有更多了',
        icon: 'loading',
        duration: 2000,
      })
      return;
    }
    query.limit(10);
    query.skip(10 * (indexnum + 1));
    query.descending('createdAt')
      .find()
      .then(list => that.setData({ list })
      ).catch(console.error);
  },
//滚动到顶部触发
  refesh: function (e) {
    var that = this;
    query.limit(10);
    query.descending('createdAt')
      .find()
      .then(list => that.setData({ list })
      ).catch(console.error);
    that.setData({
      countindex:0
    })
  },
  nameInput:function(e){
    var that = this;
    that.setData({
      userName: e.detail.value
    })
  },
  bindButtonTap:function(){
    var that = this;
    console.log('name', that.data.userName);
    if (that.data.userName==''){
      //数据数目
      query.count().then(function (count) {
        that.setData({ count });
        console.log(count);
      }, function (error) {
      });
      //数据加载
      query.limit(10);
      query.descending('createdAt')
        .find()
        .then(list => that.setData({ list })
        ).catch(console.error);
      that.setData({
        countindex:0,
        hasRefesh: false
      });
      console.log(that.data.list);
    }else{ 
      var queryIndex = new AV.Query('student');
      queryIndex.equalTo('name', that.data.userName );
      queryIndex.find().then(function (results) {
        console.log('results', results);
        if (results.length > 0) {
          that.setData({
            list: results,
          });
        } else {
          that.setData({
            list:[]
          });
        };
        console.log('list', that.data.list);
      }, function (error) {
        console.log('查询失败,请检查网络');
        that.setData({
          list:[]
        });
      });
    }
  }
})
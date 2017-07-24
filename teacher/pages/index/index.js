//index.js
//获取应用实例
const AV = require('../libs/av-weapp-min.js');
const query = new AV.Query('teacher');
Page({
  data: {
    movies: [],
    listcourse:[],
    speUrl:[],
    list:[],
    count:0,
    countindex:0    
  },
  onLoad: function () {
     console.log('加载老师信息');//进入页面时加载一次
     //调用应用实例的方法获取全局数据
    //  app.getUserInfo(function (userInfo) {
    //    //更新数据
    //    that.setData({
    //      user: userInfo
    //    })
    //  })
  },
  onShow: function () {
    // 页面显示
    var that = this;
    //获取顶部页面url地址
    var queryTop = new AV.Query('manage');
    queryTop.equalTo('imageType', '首页顶部信息');
    queryTop.find().then(function (results) {
      console.log('results', results);
      if (results.length > 0) {
        that.setData({
          movies: results[0].get('imageUrl')
        });
      } else {
        that.setData({
          movies: []
        });
      };
      console.log('objectId', that.data.src);
    }, function (error) {
      console.log('查询失败,请检查网络');
      that.setData({
        movies: []
      });
    });
    //获取精品课程信息
    var queryCourse = new AV.Query('manage');
    queryCourse.equalTo('imageType', '精品课程');
    queryCourse.find().then(function (results) {
      console.log('results', results);
      if (results.length > 0) {
        that.setData({
          listcourse: results[0].get('imageUrl')
        });
      } else {
        that.setData({
          listcourse: []
        });
      };
      console.log('objectId', that.data.src);
    }, function (error) {
      console.log('查询失败,请检查网络');
      that.setData({
        movies: ''
      });
    });
    //获取特色套餐url地址
    var querySpe = new AV.Query('manage');
    querySpe.equalTo('imageType', '特色套餐');
    querySpe.find().then(function (results) {
      console.log('results', results);
      if (results.length > 0) {
        that.setData({
          speUrl: results[0].get('imageUrl')
        });
      } else {
        that.setData({
          speUrl: []
        });
      };
      console.log('objectId', that.data.src);
    }, function (error) {
      console.log('查询失败,请检查网络');
      that.setData({
        speUrl: ''
      });
    });
    //数据数目
    query.count().then(function (count) {
      that.setData({ count });
      console.log(count);
    }, function (error) {
    });
    //数据加载
    query.ascending('createdAt')
      .find()
      .then(list => that.setData({ list })
      ).catch(console.error);
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
  },
  //滚动到底部触发
  loadMore: function (e) {
    var that = this;
    var indexnum = that.data.countindex;
    that.setData({ countindex: indexnum+1});
    if ((indexnum+1)*10 > that.data.count){
       return;
    }
    query.limit(10);
    query.skip(10 * (indexnum + 1));
    query.ascending('createdAt')
      .find()
      .then(function(list){
        if(list!= null){
          that.setData({ list })
        }
       }
      ).catch(console.error);
  },
  //滚动到顶部触发
  refesh: function (e) {
    var that = this;
    query.limit(10);
    query.ascending('createdAt')
      .find()
      .then(list => that.setData({ list })
      ).catch(console.error)
  }
})

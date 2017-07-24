const AV = require('../libs/av-weapp-min.js');
var app = getApp()
Page({
  data:{
    user: null,
    infotypes: ['首页顶部信息', '精品课程','特色套餐','报名顶部图片','注册授课顶部图片'],
    index: 6,
    imageIndex:0,
    list: [{ url:'../images/picture.png'}],
    temparray:[],
    arrayimage:[],
    Imalength:0,
    objectId:''
  },
  onLoad: function () {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        user: userInfo
      })
    })
  },
  bindPickerMaleChange:function(e){
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    console.log('picker发送选择改变，选择的值为', this.data.infotypes[e.detail.value]);
    var lengthimage = 0;
     var query = new AV.Query('manage');
     query.equalTo('imageType', this.data.infotypes[e.detail.value]);
     query.find().then(function(results){ 
       console.log('results',results);
       if (results.length >0 ){
            that.setData({
              Imalength: results.length,
              objectId:results[0].get('objectId')
            });
         }else{
            that.setData({
              Imalength: 0,
              objectId: ''
            });
         };
         console.log('Imalength', that.data.Imalength);
         console.log('objectId', that.data.objectId);
        },function(error){
          console.log('查询失败,请检查网络');
          that.setData({
            Imalength: 0,
            objectId: ''
          });
        });
    this.setData({
      index: e.detail.value
    });
    console.log('Imalength', this.data.Imalength);
     if(e.detail.value==0){
       this.setData({
         list: [{ url: '../images/picture.png' },
           { url: '../images/picture.png'},
           { url: '../images/picture.png'}]
       });
       this.setData({
         temparray: [{ url: '../images/picture.png' },
         { url: '../images/picture.png' },
         { url: '../images/picture.png' }]
       });
       this.setData({
           imageIndex: 0,
           arrayimage: []
       });
     } else if (e.detail.value == 1){
        this.setData({
         list: [{ url: '../images/picture.png' },
         { url: '../images/picture.png' },
         { url: '../images/picture.png' },
         { url: '../images/picture.png' }]
       });
        this.setData({
          temparray: [{ url: '../images/picture.png' },
          { url: '../images/picture.png' },
          { url: '../images/picture.png' },
          { url: '../images/picture.png' }]
        });
        this.setData({
          imageIndex: 0,
          arrayimage:[]
        });
     } else if (e.detail.value == 2) {
       this.setData({
         list: [{ url: '../images/picture.png' },
         { url: '../images/picture.png' }]
       });
       this.setData({
         temparray: [{ url: '../images/picture.png' },
         { url: '../images/picture.png' }]
       });
       this.setData({
         imageIndex: 0,
         arrayimage: []
       });
     }else{
       this.setData({
         list: [{ url: '../images/picture.png' }]
       });
       this.setData({
         temparray: [{ url: '../images/picture.png' }]
       });
       this.setData({
         imageIndex: 0,
         arrayimage: []
       });
     }
  },
  //图片上传
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 输入一张图片  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        that.data.temparray[that.data.imageIndex].url = 
          res.tempFilePaths[0];
        console.log('图片上传url为：', that.data.temparray) ;

        that.setData({
          list: that.data.temparray
        });
        that.data.imageIndex++;
        console.log('图片上传url为：', that.data.list);
        new AV.File('file-name', {
          blob: {
            uri: res.tempFilePaths[0],
          },
        }).save().then(
          file => that.data.arrayimage.push( file.url())).catch(console.error);
      }
    }); 
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    if (e.detail.value.checkcode != "4321") {
      wx.showToast({
        title: '验证码输入错误',
        icon: 'loading',
        duration: 2000,
      });
    } else {
      if (this.data.Imalength==0){
        // 新建一个 Todo 对象
        const Manage = AV.Object.extend('manage');
        var cremanage = new Manage();
        cremanage.set('imageType', e.detail.value.infotype);//保存图片信息列表
        cremanage.set('imageUrl', this.data.arrayimage);
        cremanage.save().then(function (todo) {//更新
        // 成功保存之后，执行其他逻辑.
        console.log('数据保存成功: ' + todo.id);
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000,
        })
      }, function (error) {
        // 异常处理
        console.error('数据保存失败: ' + error.message);
        wx.showToast({
          title: '注册失败',
          icon: 'loading',
          duration: 2000
        })
       });
      }else{
        //更新
        console.log('更新数据库', this.data.arrayimage);
        var manage = AV.Object.createWithoutData('manage', this.data.objectId);
        // 修改属性
        manage.set('imageUrl', this.data.arrayimage);
        // 保存到云端
        manage.save().then(function (todo) {//更新
        // 成功保存之后，执行其他逻辑.
        console.log('数据保存成功: ' + todo.id);
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000,
        })
      }, function (error) {
        // 异常处理
        console.error('数据保存失败: ' + error.message);
        wx.showToast({
          title: '注册失败',
          icon: 'loading',
          duration: 2000
        })
       });
      }
    }
  },
  formReset: function () {
    console.log('form发生了reset事件')
    this.setData({
      index: 6,
      imageIndex: 0,
      list: [{ url: '../images/picture.png' }],
      temparray: [],
      arrayimage: [],
      Imalength: 0
    })
  }
})
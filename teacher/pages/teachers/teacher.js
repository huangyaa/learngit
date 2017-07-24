const AV = require('../libs/av-weapp-min.js');
var app = getApp()
Page({
  data: {
    tempFilePath: '../images/picture.png',
    user: null,
    arrayMale: ['男', '女'],
    indexMale: 3,
    courses: [
      { name: '英语', value: '英语' },
      { name: '数学', value: '数学' },
      { name: '语文', value: '语文' },
      { name: '文综', value: '文综' },
      { name: '理综', value: '理综' },
      { name: '计算机', value: '计算机' },
    ],
    Coursename: "",
    curIndex: 0,
    src: '',
    mode: 'scaleToFill',
    pictureurl:'',
    isUpdate:'',
    objectId:'',
    name:'',
    phone:''
  },
  onLoad: function () {
    var that = this;
    //检查是否已经注册
    var id = app.globalData.userLC.authData.lc_weapp.openid;
    console.log('id', id);
    //调用应用实例的方法获取全局数据
    var query = new AV.Query('teacher');
    query.equalTo('id', id);
    query.find().then(function (results) {
      console.log('results', results);
      if (results.length > 0) {
        that.setData({
          isUpdate: true,
          name: results[0].get('name'),
          phone: results[0].get('phonenum'),
          tempFilePath: results[0].get('selfImg'),
          pictureurl: results[0].get('selfImg'),
          objectId: results[0].get('objectId')
        });
      } else {
        that.setData({
          isUpdate: false,
          name:'',
          phone:'',
          tempFilePath: '../images/picture.png',
          pictureurl:'',
          objectId: ''
        });
      };
      console.log('isUpdate', that.data.isUpdate);
      console.log('objectId', that.data.objectId);
    }, function (error) {
      console.log('查询失败,请检查网络');
      that.setData({
        isUpdate: false,
        name:'',
        phone:'',
        pictureurl: '',
        tempFilePath: '../images/picture.png',
        objectId: ''
      });
    });
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        user: userInfo
      })
    });
  },
  onShow:function(){
    var that = this;
    var query = new AV.Query('manage');
    query.equalTo('imageType', '注册授课顶部图片');
    query.find().then(function (results) {
      console.log('results', results);
      if (results.length > 0) {
        that.setData({
          src: results[0].get('imageUrl')[0],
        });
      } else {
        that.setData({
          src: ''
        });
      };
      console.log('objectId', that.data.src);
    }, function (error) {
      console.log('查询失败,请检查网络');
      that.setData({
        src:''
      });
    });
  },
  //姓名
  nameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  bindPickerMaleChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      indexMale: e.detail.value
    })
  },
  courseboxChange: function (e) {
    this.setData({
      Coursename: e.detail.value
    });
    console.log('picker发送选择改变，携带值为', this.data.Coursename)
  },
  checkInput:function(e){
    console.log('输入的验证码为', e.detail.value);
  },
 //图片上传
  chooseimage: function () {
        var that = this;
        wx.chooseImage({
            count: 1, // 输入一张图片  
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
              that.setData({
                    tempFilePath: res.tempFilePaths[0]  
              });
              var tempFilePath = res.tempFilePaths[0];
                new AV.File('file-name', {
                    blob: {  
                        uri: tempFilePath,
                     },
                  }).save().then(
                  file => that.data.pictureurl = file.url()).catch(console.error);
      }  
   })
  },
  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    console.log('图片URL：', this.data.pictureurl);
    if (e.detail.value.mobileNum == "" || e.detail.value.mobileNum.length!=11) {
      wx.showToast({
        title: '联系方式输入错误',
        icon: 'loading',
        duration: 2000,
      });
      //TODO,对于已经有提交的数据可以进行修改，根据id（唯一性）

    } else if (e.detail.value.checkcode!="1234"){
      wx.showToast({
        title: '验证码输入错误',
        icon: 'loading',
        duration: 2000,
      });
      }else{
      if (this.data.isUpdate) {
        //更新
        console.log('更新数据库', this.data.arrayimage);
        var teacherUp = AV.Object.createWithoutData('teacher', this.data.objectId);
        // 修改属性
        teacherUp.set('phonenum', e.detail.value.mobileNum);
        teacherUp.set('name', e.detail.value.userName);
        teacherUp.set('male', e.detail.value.male);
        teacherUp.set('courses', this.data.Coursename + "");
        teacherUp.set('selfImg', this.data.pictureurl);
        // 保存到云端
        teacherUp.save().then(function (todo) {//更新
          // 成功保存之后，执行其他逻辑.
          console.log('数据更新成功: ' + todo.id);
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
          })
        }, function (error) {
          // 异常处理
          console.error('数据更新失败: ' + error.message);
          wx.showToast({
            title: '注册失败',
            icon: 'loading',
            duration: 2000
          })
        });
      } else {//新增一条数据
        var Teacher = AV.Object.extend('teacher');
        // 新建一个 Todo 对象
        var teacher = new Teacher();
        teacher.set('id', app.globalData.userLC.authData.lc_weapp.openid);
        teacher.set('phonenum', e.detail.value.mobileNum);
        teacher.set('name', e.detail.value.userName);
        teacher.set('male', e.detail.value.male);  
        teacher.set('courses', this.data.Coursename + "");
        teacher.set('selfImg', this.data.pictureurl);
        teacher.save().then(function (todo) {
          // 成功保存之后，执行其他逻辑.
          console.log('数据插入成功: ' + todo.id);
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
          })
        }, function (error) {
          // 异常处理
          console.error('数据插入失败: ' + error.message);
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
  }
})  

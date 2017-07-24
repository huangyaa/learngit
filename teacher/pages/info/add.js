const AV = require('../libs/av-weapp-min.js');
var app = getApp()
Page({
      data: {  
            user: null,
            arrayMale: ['男', '女'],
            indexMale: 3,
            arrayGrad: ['小学', '初中','高中'],
            indexGrad: 10,
            arrayClass: ['一', '二', '三','四','五','六'],
            arrayClass1: ['一', '二', '三'],
            indexClass: 10,
            indexClass1: 10,
            courses: [
              { name: '英语', value: '英语' },
              { name: '数学', value: '数学' },
              { name: '语文', value: '语文' },
              { name: '文综', value: '文综' },
              { name: '理综', value: '理综' },
              { name: '计算机', value: '计算机' },
            ],
            Coursename: "",
            navLeftItems: ['报名','查询'],    
            curIndex: 0 ,
            src:'',
            mode: 'scaleToFill',
            isUpdate:false,
            objectId:'',
            name:'',
            phone:''
      },
      onLoad: function () {
          var that = this;
          //检查是否已经注册
          var id = app.globalData.userLC.authData.lc_weapp.openid;
          console.log('id',id);
          //调用应用实例的方法获取全局数据
          var query = new AV.Query('student');
          query.equalTo('id', id);
          query.find().then(function (results) {
            console.log('results', results);
            if (results.length > 0) {
              that.setData({
                isUpdate: true,
                name: results[0].get('name'),
                phone: results[0].get('phoneNum'),
                objectId: results[0].get('objectId')
              });
            } else {
              that.setData({
                isUpdate: false,
                name:'',
                phone:'',
                objectId:''
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
              objectId:''
            });
          });
          //获取基本用户信息
          app.getUserInfo(function(userInfo){
            //更新数据
            that.setData({
              user:userInfo
            })
          })
    },
    onShow:function(){
      var that = this;
      var query = new AV.Query('manage');
      query.equalTo('imageType', '报名顶部图片');
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
          name: e.detail.value
        })
      },
    bindPickerMaleChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          indexMale: e.detail.value
        })
    },
    bindPickerGradChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        indexGrad: e.detail.value
      })
    },
    courseboxChange: function (e) {
      //console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        Coursename: e.detail.value
      });
      console.log('picker发送选择改变，携带值为', this.data.Coursename)
    },
    //小学学选择器
    classPickerChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        indexClass: e.detail.value
      })
    },
    //中学选择器
    classPickerChange1: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        indexClass1: e.detail.value
      })
    },
    //事件处理函数  
    switchRightTab: function(e) {
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
        if (e.detail.value.mobileNum == "" || e.detail.value.mobileNum.length != 11) {
          wx.showToast({
            title: '联系方式输入错误',
            icon: 'loading',
            duration: 2000,
          });
        }else{
        if(this.data.isUpdate){
          //更新
          console.log('更新数据库', this.data.arrayimage);
          var studentUp = AV.Object.createWithoutData('student', this.data.objectId);
          // 修改属性
          studentUp.set('phoneNum', e.detail.value.mobileNum);
          studentUp.set('name', e.detail.value.userName);
          studentUp.set('male', e.detail.value.male);
          studentUp.set('grade', e.detail.value.grade);
          studentUp.set('class', e.detail.value.class);
          studentUp.set('courses', this.data.Coursename + "");
          // 保存到云端
          studentUp.save().then(function (todo) {//更新
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
        }else {//新增一条数据
          var Student = AV.Object.extend('student');
          // 新建一个 Todo 对象
          var student = new Student();
          student.set('id', app.globalData.userLC.authData.lc_weapp.openid);
          student.set('phoneNum', e.detail.value.mobileNum);
          student.set('name', e.detail.value.userName);
          student.set('male', e.detail.value.male);
          student.set('grade', e.detail.value.grade);
          student.set('class', e.detail.value.class);
          student.set('courses', this.data.Coursename + "");
          student.set('firstImg', app.globalData.userInfo.avatarUrl);
          student.set('ispay','否');
          student.save().then(function (todo) {
            // 成功保存之后，执行其他逻辑.
            console.log('数据插入成功: ' + student.id);
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

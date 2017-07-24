const AV = require('../libs/av-weapp-min.js');
var app = getApp();
Page({
  data: {
    // text:"这是一个页面"
    id:'',
    objectId:'',
    imgUrl:'',
    name:'',
    male:'',
    grade:'',
    class:'',
    courses: '',
    ispay:false,
    comment:'',
    ispay:'',
    choicepay: [
      { value: '否' },
      { value: '是' },
    ],
    isTeacher:false,
    tempcom:'',
    payvalue:'',
    newcom:''
  },

  onLoad: function (options) {
    var that = this;
    console.log('detailStudent:', options.id);
    //是否为老师
    //判断是否为老师
    const query = new AV.Query('teacher');
    query.equalTo('id', app.globalData.userLC.authData.lc_weapp.openid);
    query.find().then(function (results) {
      console.log('results', results);
      if (results.length > 0) {
        that.setData({
          isTeacher: true
        })
      } else {
        that.setData({
          isTeacher: false
        })
      };
      console.log('comment', that.data.comment);
    }, function (error) {
      console.log('查询失败,请检查网络');
      that.setData({
        isTeacher: false
      })
    });
    //用户微信码值，用于评论更新
    that.setData({
      id: options.id
    });
    console.log('isTeacher:', that.data.isTeacher);
    //学生信息查询
    var detailStudent = new AV.Query('student');
    detailStudent.equalTo('id',options.id);
    detailStudent.find().then(function (results) {
      console.log('results', results);
      if (results.length > 0) {
        that.setData({
          imgUrl: results[0].get('firstImg'),
          name: results[0].get('name'),
          male: results[0].get('male'),
          grade: results[0].get('grade'),
          class: results[0].get('class'),
          courses: results[0].get('courses'),
          ispay: results[0].get('ispay'),
          objectId: results[0].get('objectId'),
        });
      } else {
        that.setData({
          imgUrl: '',
          name: '',
          male: '',
          grade: '',
          class: '',
          courses: '',
          ispay: '',
          objectId:''
        });
      };
    }, function (error) {
      console.log('查询失败,请检查网络');
      that.setData({
        imgUrl: '',
        name: '',
        male: '',
        grade: '',
        class: '',
        courses: '',
        ispay: '',
        objectId: ''
      });
    });

    //评语
    var teacherComment = new AV.Query('appraise');
    teacherComment.equalTo('id', options.id);
    teacherComment.descending('createdAt').find().then(function (results) {
      console.log('results', results);
      if (results.length > 0) {
        that.setData({
          comment: results[0].get('comment'),
          tempcom: results[0].get('comment')
        });
      } else {
        that.setData({
          comment: '',
          tempcom: ''
        });
      };
      console.log('comment', that.data.comment);
    }, function (error) {
      console.log('查询失败,请检查网络');
      that.setData({
        comment: ''
      });
    });
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      payvalue: e.detail.value
    })
  },
  appraiseInput:function (e){
    console.log('input输入完成，携带value值为：', e.detail.value);
    this.setData({
       newcom: e.detail.value
    })
  },
  formReset:function(){
    this.setData({
      payvalue: '',
      comment: this.data.tempcom,
      newcom:''
    })
  },
  formSub:function (){
    //插入一条评论
    var that = this;
    const Appraise = AV.Object.extend('appraise');
    var appraise = new Appraise();
    appraise.set('id', that.data.id);//保存图片信息列表
    appraise.set('comment', that.data.newcom);
    appraise.save().then(function (todo) {//更新
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
    //更新缴费信息
    var Student = AV.Object.createWithoutData('student', this.data.objectId);
    // 修改属性
    Student.set('ispay', that.data.payvalue);
    // 保存到云端
    Student.save().then(function (todo) {//更新
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
})
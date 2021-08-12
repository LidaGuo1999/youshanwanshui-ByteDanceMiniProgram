// /Users/mac/Documents/Study/Research/字节跳动字学镜像计划/DaDa/pages/travel-new/travel-new

const app = getApp();

Page({
  data: {
    travelDate: "2021-06-24",
    fiveGradeItems: [
      {value: "one", name: "一星"},
      {value: "two", name: "二星"},
      {value: "three", name: "三星"},
      {value: "four", name: "四星"},
      {value: "five", name: "五星"},
    ],
    tmpImagePaths: [],
    finalImagePathPrefix: '',
    remainImageNum: 9,
    title: '',
  },
  onLoad: function (options) {
    if (!app.isLogin) {
      tt.showToast({
        title: '请先登录！',
        icon: 'fail'
      });
      tt.switchTab({
        url: '/pages/index/index' // 指定页面的url
      });
    } else {
      this.setData({tmpImagePaths: []});
    }
  },
  onShow: function (options) {
    if (!app.isLogin) {
      tt.showToast({
        title: '请先登录！',
        icon: 'fail'
      });
      tt.switchTab({
        url: '/pages/index/index' // 指定页面的url
      });
    } else {
      this.setData({tmpImagePaths: []});
    }
  },
  bindDateChange: function (event) {
    this.setData({
      travelDate: event.detail.value,
    });
  },
  picUploadTap: function (options) {
    var that = this;
    tt.chooseImage({
      count: that.data.remainImageNum,
      success: (res) => {
        var tmp = that.data.tmpImagePaths;
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          if (tmp.length >= 9) break;
          tmp.push(res.tempFilePaths[i]);
        }
        console.log(tmp);
        that.setData({
          tmpImagePaths: tmp,
          remainImageNum: 9 - tmp.length,
        });
        tt.showToast({title: '照片上传成功'});
      },
    });
  },
  picPreviewTap: function (event) {
    var current = event.target.dataset.src;
    tt.previewImage({
      current: current,
      urls: this.data.tmpImagePaths, // 图片地址列表
    });
  },
  formSubmit: function (event) {
    if (!this.checkComplete(event)) {
      return ;
    }
    console.log(event.detail);
    this.setData({title: event.detail.value.title});
    tt.request({
      url: app.backendIndex + 'postNode', // 目标服务器url
      method: "POST",
      data: {
        openid: app.openid,
        title: event.detail.value.title,
        date: event.detail.value.date,
        place: event.detail.value.location,
        transportation: event.detail.value.transportation,
        price: event.detail.value.price,
        commentText: event.detail.value.commentText,
        commentRadio: event.detail.value.commentRadio,
        recommendation: event.detail.value.recommendation,
        picNum: this.data.tmpImagePaths.length
      },
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      success: (res) => {
        console.log(res);
      }, 
      fail: (res) => {
        console.log("fail");
      }
    });
    for (var i = 0; i < this.data.tmpImagePaths.length; i++) {
      tt.uploadFile({
        url: app.backendIndex + 'uploadPic', // 目标地址
        filePath: this.data.tmpImagePaths[i], // 本地文件路径
        name: 'file', // HTTP请求的文件名
        formData: {
          genre: 'pic',
          openid: app.openid,
          nodeName: event.detail.value.title,
          index: i.toString()
        },
        success: (res) => {
          console.log(res);
        },
        fail: (res) => {
          console.log(res);
        }
      });
    }
    tt.showToast({title: '提交成功'});
    tt.switchTab({
      url: '/pages/index/index' // 指定页面的url
    });
  },
  formReset: function (event) {
    tt.switchTab({
      url: '/pages/travel-new/travel-new' // 指定页面的url
    });
    tt.showToast({title: '表单已重置'});
  },
  checkComplete: function (event) {
    var value = event.detail.value;
    var warns = [];

    if (value.title == 'undefined' || !(value.title) || !/[^\s]/.test(value.title)) {
      warns.push('标题');
    }
    if (value.date == 'undefined' || !(value.date) || !/[^\s]/.test(value.date)) {
      warns.push('旅行日期');
    }
    if (value.location == 'undefined' || !(value.location) || !/[^\s]/.test(value.location)) {
      warns.push('旅行地点');
    }
    if (value.transportation == 'undefined' || !(value.transportation) || !/[^\s]/.test(value.transportation)) {
      warns.push('交通方式');
    }
    if (value.price == 'undefined' || !(value.price) || !/[^\s]/.test(value.price)) {
      warns.push('景区花费');
    }
    if (value.commentRadio == 'undefined' || !(value.commentRadio) || !/[^\s]/.test(value.commentRadio)) {
      warns.push('景点星级评价');
    }
    if (value.commentText == 'undefined' || !(value.commentText) || !/[^\s]/.test(value.commentText)) {
      warns.push('景点文字评价');
    }
    if (value.recommendation == 'undefined' || !(value.recommendation) || !/[^\s]/.test(value.recommendation)) {
      warns.push('游览建议');
    }

    if (warns.length > 0) {
      tt.showToast({
        title: warns[0] + '未填写！',
        icon: 'none' 
      })
      return false;
    }

    return true;
  }
})
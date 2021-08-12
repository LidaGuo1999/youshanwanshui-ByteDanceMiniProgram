// /Users/mac/Documents/Study/Research/字节跳动字学镜像计划/游山玩水/pages/changeGender/changeGender
const app = getApp();

Page({
  data: {
    inputValue: ''
  },
  onLoad: function (options) {
    this.loadOriginName();
  },
  onShow: function (options) {
    this.loadOriginName();
  },
  handleInput: function (event) {
    this.setData({inputValue: event.detail.value});
  },
  loadOriginName: function (options) {
    var pages = getCurrentPages();
    this.setData({inputValue: pages[pages.length - 2].data.gender});
  }, 
  saveNameTap: function (options) {
    var that = this;
    tt.request({
      url: app.backendIndex + 'changeUserInfo', // 目标服务器url
      method: "POST",
      data: {
        openid: app.openid,
        which: "gender",
        value: this.data.inputValue
      },
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      success: (res) => {
        console.log(res);
        if (res.data == "error") {
          tt.showToast({
            title: "修改失败！",
            icon: "fail"
          });
        } else {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({gender: that.data.inputValue});
          app.userInfo.gender = that.data.inputValue;
          //console.log(prevPage);
          tt.showToast({
            title: res.data,
            icon: 'success'
          });
        }
      }, 
      fail: (res) => {
        console.log("fail");
        tt.showToast({
          title: '修改失败！',
          icon: 'fail'
        })
      }
    });
    setTimeout(() => {
      tt.navigateBack();
    }, 1000);
  }
})
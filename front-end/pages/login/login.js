// /Users/mac/Documents/Study/Research/字节跳动字学镜像计划/DaDa/pages/login/login

const app = getApp();

Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function (options) {

  },
  loginTap: function (options) {
    tt.login({
      success(res) {
        console.log('login调用成功' + res.code);
      },
      fail(res) {
        console.log('login调用失败 ' + res.errMsg);
      },
    });
  }
})
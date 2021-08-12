// /Users/mac/Documents/Study/Research/字节跳动字学镜像计划/游山玩水/pages/changePhone/changePhone
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
    this.setData({inputValue: pages[pages.length - 2].data.phone});
  }, 
  saveNameTap: function (options) {
    var that = this;
    tt.request({
      url: app.backendIndex + 'changeUserInfo', // 目标服务器url
      method: "POST",
      data: {
        openid: app.openid,
        which: "phone",
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
          prevPage.setData({phone: that.phoneMask(that.data.inputValue)});
          app.userInfo.phone = that.data.inputValue;
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
  },
  phoneMask: function (ph) {
    if (/.*[\u4e00-\u9fa5]+.*$/.test(ph)) return ph;
    var prefix = ph.slice(0, 3), suffic = ph.slice(-4);
    var leng = ph.length;
    var stars = '';
    for (var i = 0; i < leng-7; i++) stars += '*';
    return prefix + stars + suffic;
  },
})
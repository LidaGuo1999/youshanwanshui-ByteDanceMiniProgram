// /Users/mac/Documents/Study/Research/字节跳动字学镜像计划/游山玩水/pages/strategy-new/strategy-new

const app = getApp();

Page({
  data: {
    nodes: [],
    titleValue: '',
    abstractValue: ''
  },
  onLoad: function (options) {
    this.getNodes();
    this.setData({abstractValue: ''});
  },
  onShow: function (options) {
    this.getNodes();
    this.setData({abstractValue: ''});
  },
  handleTitleInput: function (event) {
    const value = event.detail.value;
    this.setData({titleValue: value});
  },
  handleAbstractInput: function (event) {
    const value2 = event.detail.value;
    this.setData({abstractValue: value2});
  },
  getNodes: function (options) {
    var that = this;
    tt.request({
      url: app.backendIndex + 'getNodes?openid=' + app.openid, // 目标服务器url
      success: (res) => {
        console.log(res);
        var nodes = [];
        for (var i = 0; i < res.data.nodes.length; i++) {
          var tmp = {name: res.data.nodes[i], checked: false};
          nodes.push(tmp);
        }
        that.setData({
          nodes: nodes
        });
      },
      fail: (res) => {
        console.log(res);
      }
    });
  },
  checkboxChange: function (event) {
    var nodes = this.data.nodes, values = event.detail.value;
    for (var i = 0, lenI = nodes.length; i < lenI; ++i) {
      nodes[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (nodes[i].name == values[j]) {
          nodes[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      nodes: nodes
    });
  },
  formSubmit: function (event) {
    console.log(event.detail);
    tt.request({
      url: app.backendIndex + 'postStrategy', // 目标服务器url
      method: "POST",
      data: {
        openid: app.openid,
        title: event.detail.value.title,
        abstract: event.detail.value.abstract,
        nodes: event.detail.value.chooseNodes
      },
      header: {"Content-Type": "application/x-www-form-urlencoded"},
      success: (res) => {
        console.log(res);
      }, 
      fail: (res) => {
        console.log("fail");
      }
    });
    tt.showToast({title: '提交成功'});
    tt.navigateBack();
  },
  formReset: function (event) {
    this.onLoad();
    tt.showToast({title: '表单已重置'});
  }
})
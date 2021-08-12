// /Users/mac/Documents/Study/Research/字节跳动字学镜像计划/游山玩水/pages/travel-storage/travel-storage

const app = getApp();

Page({
  data: {
    strategies: [],
    nodes: []
  },
  onLoad: function (options) {
    this.getStrategies();
    this.getNodes();
  },
  onShow: function (options) {
    this.getStrategies();
    this.getNodes();
  },
  getNodes: function (options) {
    var that = this;
    tt.request({
      url: app.backendIndex + 'getNodes?openid=' + app.openid, // 目标服务器url
      success: (res) => {
        //console.log(res);
        that.setData({
          nodes: res.data.nodes
        });
      },
      fail: (res) => {
        console.log(res);
      }
    });
  },
  getStrategies: function (options) {
    var that = this;
    tt.request({
      url: encodeURI(app.backendIndex + 'getStrategies?openid=' + app.openid), // 目标服务器url
      success: (res) => {
        //console.log(res);
        that.setData({
          strategies: res.data.strategies
        });
      },
      fail: (res) => {
        console.log(res);
      }
    });
  },
  strategyViewTap: function (event) {
    console.log(event);
    app.currentStrategy = event.target.dataset.name;
    app.searchOpenid = app.openid;
    tt.navigateTo({
      url: '/pages/strategy-display/strategy-display' // 指定页面的url
    });
  },
  strategyDelTap: function (event) {
    var that = this;
    tt.showModal({
      content: "您确定要删除该景点攻略吗",
      success: (res) => {
        if (res.confirm) {
          console.log('confirm');
          tt.request({
            url: encodeURI(app.backendIndex + 'delStrategies?openid=' + app.openid + '&strategyName=' + event.target.dataset.name), // 目标服务器url
            success: (res) => {
              console.log('delete success');
              that.getStrategies();
            },
            fail: (res) => {
              console.log('delete fail');
            }
          });
        } else {
          console.log('cancel');
        }
      }
    });
  },
  nodeViewTap: function (event) {
    app.currentNode = event.target.dataset.name;
    app.searchOpenid = app.openid;
    tt.navigateTo({
      url: '/pages/travel-display/travel-display' // 指定页面的url
    });
  },
  nodeDelTap: function (event) {
    var that = this;
    tt.showModal({
      content: "您确定要删除该景点攻略吗",
      success: (res) => {
        if (res.confirm) {
          console.log('confirm');
          tt.request({
            url: app.backendIndex + 'delNodes?openid=' + app.openid + '&nodeName=' + event.target.dataset.name, // 目标服务器url
            success: (res) => {
              console.log('delete success');
              that.getNodes();
            },
            fail: (res) => {
              console.log('delete fail');
            }
          });
        } else {
          console.log('cancel');
        }
      }
    });
  },
  strategyGenerateTap: function (event) {
    tt.navigateTo({
      url: '/pages/strategy-new/strategy-new' // 指定页面的url
    });
  }
})
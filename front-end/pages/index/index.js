const app = getApp()

Page({
  data: {
    text: 'This is index.', 
    authorName: 'Lida Guo',
    imageFolder: '/../pic/',
    imageUrl: "https://img1.baidu.com/it/u=1001140945,1035662655&fm=26&fmt=auto&gp=0.jpg",
    displayImages: ['display-image-1', 'display-image-2', 'display-image-3'],
    isOdd: false,
    strategyLast: -1,
    strategyNum: [],
    strategies1: [],
    strategies2: [],
    searchValue: '',
  },
  onLoad: function () {
    this.getRecommendStrategies();
  },
  onShow: function () {
    this.getRecommendStrategies();
  },
  getRecommendStrategies: function () {
    var that = this;
    tt.request({
      url: app.backendIndex + 'getRecommendStrategies', // 目标服务器url
      success: (res) => {
        if (res.data == 'error') {
          tt.showToast({
            title: '数据库连接失败', // 内容
            icon: 'fail'
          });
        } else {
          var allStrategies = res.data.recommend;
          var tmp1 = [], tmp2 = [], tmpNum = [];
          for (var i = 0; i < allStrategies.length; i += 2) {
            tmp1.push(allStrategies[i]);
            if (i+1 < allStrategies.length) {
              tmp2.push(allStrategies[i+1]);
            }
          } 

          for (var i = 0; i < tmp2.length; i++) tmpNum.push(i);
          that.setData({
            strategyLast: (allStrategies.length+1)/2-1,
            strategyNum: tmpNum,
            strategies1: tmp1,
            strategies2: tmp2
          });

          if (allStrategies.length%2 == 0) {
            that.setData({isOdd: false});
          } else {
            that.setData({isOdd: true});
          }
        }
      },
      fail: (res) => {
        console.log('请求错误');
        console.log(res);
      }
    });
  },
  searchTap(event) {
    console.log(this.data.searchValue);
    var that = this;
    tt.request({
      url: encodeURI(app.backendIndex+'search?genre=both&keyword='+this.data.searchValue), // 目标服务器url
      success: (res) => {
        //console.log(res);
        app.searchResults.nodes = res.data.nodes;
        app.searchResults.strategies = res.data.strategies;
      },
      fail: (res) => {
        tt.showToast({
          title: '服务器连接故障',
          icon: 'fail'
        })
      }
    });
    setTimeout(() => {
      tt.navigateTo({
        url: '/pages/search-display/search-display' // 指定页面的url
      });
    }, 0);
  },

  searchHandleInput(event) {
    console.log(event.detail.value);
    this.setData({
      searchValue: event.detail.value,
    });
    return event.detail.value;
  },
  showTabBar() {
    tt.showTabBar({
      animation: true,
      success(res) {
        console.log('tabBar显示成功');
      }
    });
  },
  viewStrategy: function (event) {
    console.log(event);
    app.currentStrategy = event.target.dataset.name;
    app.searchOpenid = 'general';
    tt.navigateTo({
      url: '/pages/strategy-display/strategy-display' // 指定页面的url
    });
  },
})

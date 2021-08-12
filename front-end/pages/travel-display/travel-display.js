// /Users/mac/Documents/Study/Research/字节跳动字学镜像计划/游山玩水/pages/travel-display/travel-display

const app = getApp();

Page({
  data: {
    currentNode: app.currentNode,
    date: '',
    place: '',
    transportation: '',
    price: '',
    commentText: '',
    commentRadio: '',
    recommendation: '',
    fiveGradeItems: [
      {value: "one", name: "一星", checked: false},
      {value: "two", name: "二星", checked: false},
      {value: "three", name: "三星", checked: false},
      {value: "four", name: "四星", checked: false},
      {value: "five", name: "五星", checked: false},
    ],
    tmpImagePaths: [],
    test: app.tmpFiles,
    finalImagePathPrefix: '',
    remainImageNum: 9,
    picNum: ''
  },
  onLoad: function (options) {
    console.log(app.searchOpenid, app.currentNode);
  },
  onShow: function (options) {
    this.infoReload();
  },
  infoReload: function (options) {
    var that = this;
    that.setData({currentNode: app.currentNode});
    console.log(this.data.currentNode);
    tt.request({
      url: encodeURI(app.backendIndex + 'getNodeDetail?openid=' + app.searchOpenid + '&nodeName=' + this.data.currentNode), // 目标服务器url,
      success: (res) => {
        console.log(res);
        if (res.data == 'error') {
          tt.showToast({
            title: '数据库中无此攻略', // 内容
            icon: 'fail',
          });
          tt.navigateBack();
        } else {
          that.setData({
            date: res.data.date,
            place: res.data.place,
            transportation: res.data.transportation,
            price: res.data.price,
            commentText: res.data.commentText,
            commentRadio: res.data.commentRadio,
            recommendation: res.data.recommendation,
            picNum: res.data.picNum
          });
          var items = that.data.fiveGradeItems;
          switch (that.data.commentRadio) {
            case '一星':
              items[0].checked = true;
              break;
            case '二星':
              items[1].checked = true;
              break;
            case '三星':
              items[2].checked = true;
              break;
            case '四星':
              items[3].checked = true;
              break;
            case '五星':
              items[4].checked = true;
              break;
          }
          that.setData({fiveGradeItems: items});

          var filePaths = [];
          var listen;
          var finish = false;
          for (var i = 0; i < parseInt(that.data.picNum); i++) {
            // 请求一张图片
            console.log(app.currentNode);
            tt.downloadFile({
              url: encodeURI(app.backendIndex + 'downloadPic?openid=' + app.searchOpenid + '&nodeName=' + app.currentNode + '&index=' + i.toString()), // 文件地址
              success: (res) => {
                //console.log(res);
                filePaths.push(res.tempFilePath);
              },
              fail: (res) => {
                console.log(res);
              }
            });
          }
          setTimeout(() => {
            //console.log(filePaths);
            that.setData({
              tmpImagePaths: filePaths,
              picNum: filePaths.length
            });
          },300);
          //that.setData({tmpImagePaths: filePaths});
        }
      },
      fail: (res) => {
        console.log(res);
        tt.showToast({
          title: '网络连接故障', // 内容
          icon: 'fail',
        });
        tt.navigateBack();
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
})
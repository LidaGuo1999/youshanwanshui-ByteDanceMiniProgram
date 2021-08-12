// /Users/mac/Documents/Study/Research/字节跳动字学镜像计划/游山玩水/pages/strategy-display/strategy-display

const app = getApp();

Page({
  data: {
    strategy: '',
    nodes: [],
    current: '',
    fiveGradeItems: [
      {value: "one", name: "一星", checked: false},
      {value: "two", name: "二星", checked: false},
      {value: "three", name: "三星", checked: false},
      {value: "four", name: "四星", checked: false},
      {value: "five", name: "五星", checked: false},
    ],
    allPaths: [],
  },
  onLoad: function (options) {
    this.setData({strategy: app.currentStrategy});
    this.getNodes();
    setTimeout(() => {
      //console.log(this.data.allPaths);
      this.distributePics();
    }, 100);
  },
  onShow: function (options) {

  },
  distributePics: function (options) {
    var count = 0, tmpNodes = this.data.nodes;
    for (var i = 0; i < this.data.nodes.length; i++) {
      var n = tmpNodes[i]['picNum'];
      tmpNodes[i]['tmpImagePaths'] = this.data.allPaths.slice(count, count+n);
      count += n;
    }
    this.setData({nodes: tmpNodes});
    //console.log(this.data.nodes[0]);
  },
  getNodes: function (options) {
    var that = this;
    tt.request({
      url: encodeURI(app.backendIndex + 'getStrategyDetail?openid=' + app.searchOpenid + '&strategyName=' + app.currentStrategy), // 目标服务器url
      success: (res) => {
        console.log(res);
        var tmpNodes = res.data.nodes;
        var thatt = this;
        
        for (var i = 0; i < tmpNodes.length; i++) {
          tmpNodes[i]['index'] = (i+1).toString();
          tmpNodes[i]['fiveGradeItems'] = [
            {value: "one", name: "一星", checked: false},
            {value: "two", name: "二星", checked: false},
            {value: "three", name: "三星", checked: false},
            {value: "four", name: "四星", checked: false},
            {value: "five", name: "五星", checked: false},
          ];
          switch (tmpNodes[i]['commentRadio']) {
            case '一星':
              tmpNodes[i]['fiveGradeItems'][0].checked = true;
              break;
            case '二星':
              tmpNodes[i]['fiveGradeItems'][1].checked = true;
              break;
            case '三星':
              tmpNodes[i]['fiveGradeItems'][2].checked = true;
              break;
            case '四星':
              tmpNodes[i]['fiveGradeItems'][3].checked = true;
              break;
            case '五星':
              tmpNodes[i]['fiveGradeItems'][4].checked = true;
              break;
          }
        }
        that.setData({
          nodes: tmpNodes,
          current: '1'
        });
        var allPaths = [];
        var i;
        for (i = 0; i < tmpNodes.length; i++) {
          var filePaths = [];
          //console.log(filePaths);
          var listen;
          var finish = false;
          tmpNodes[i]['tmpImagePaths'] = [];
          if (tmpNodes[i]['picNum'] == null) {
            
            continue;
          }

          for (var j = 0; j < parseInt(tmpNodes[i]['picNum']); j++) {
            // 请求一张图片
            //console.log(j);
            tt.downloadFile({
              url: encodeURI(app.backendIndex + 'downloadPic?openid=' + app.searchOpenid + '&nodeName=' + tmpNodes[i]['title'] + '&index=' + j.toString()), // 文件地址
              success: (res) => {
                filePaths.push(res.tempFilePath);
                that.data.allPaths.push(res.tempFilePath);
                //tmpNodes[i].tmpImagePaths = filePaths;
                //console.log(filePaths);
              },
              fail: (res) => {
                console.log(res);
              }
            });
          }
          //tmpNodes[i]['tmpImagePaths'] = filePaths;
          //console.log(filePaths);
        }
        setTimeout(() => {
          //console.log(filePaths);
          that.setData({
            nodes: tmpNodes,
            current: that.data.current
          });
          },300);
        
        //console.log(this.data.nodes);
      },
      fail: (res) => {
        console.log(res);
      }
    });
  },
  swiperChange: function (event) {
    //console.log(event);
  },
  picPreviewTap: function (event) {
    var current = event.target.dataset.src;
    var index = parseInt(event.target.dataset.index);
    tt.previewImage({
      current: current,
      urls: this.data.nodes[index-1]['tmpImagePaths'] // 图片地址列表
    });
  },
})
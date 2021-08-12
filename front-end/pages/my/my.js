// /Users/mac/Documents/Study/Research/字节跳动字学镜像计划/DaDa/pages/my/my

const app = getApp();

Page({
  data: {
    headUrl: "",
    openid: "",
    userName: "未登录",
    isLogin: false,
    phone: "未登录",
    gender: '未登录',
    age: '未登录',
    storage: '未登录'
  },
  onLoad: function (options) {
    //console.log(app.userInfo);
    this.setData({isLogin: app.isLogin});
    if (!app.isLogin) {
      this.setData({
        headUrl: "",
        userName: "未登录",
        phone: "未登录",
      });
    } else {
      //console.log(app.userInfo);
      this.setData({
        headUrl: app.userInfo.headUrl,
        userName: app.userInfo.userName,
        phone: this.phoneMask(app.userInfo.phone),
        gender: app.userInfo.gender,
        age: app.userInfo.age,
        storage: '>'
      });
    }
  },
  onShow: function (options) {
    //console.log(app.userInfo);
    this.setData({isLogin: app.isLogin});
    if (!app.isLogin) {
      this.setData({
        headUrl: "",
        userName: "未登录",
        phone: "未登录",
      });
    } else {
      this.setData({
        headUrl: app.userInfo.headUrl,
        userName: app.userInfo.userName,
        phone: this.phoneMask(app.userInfo.phone),
        gender: app.userInfo.gender,
        age: app.userInfo.age,
        storage: '>'
      });
    }
  },
  loginTap: function (options) {
    var that = this;
    tt.login({
      success(res) {
        //console.log('login调用成功\n' + res.code);
        tt.request({
          url: 'https://developer.toutiao.com/api/apps/jscode2session?appid=tta27ad4c73d42a41f01&secret=16a08825fa10b7ab3dbdd8d048dd06ee0b322788&code=' + res.code, // 目标服务器url
          success: (res) => {
            //console.log(res);
            //console.log('code2session成功');
            app.openid = res.data.openid;
            that.setData({openid: res.data.openid});
            tt.getUserInfo({
              withCredentials: false,
              success(res) {
                app.isLogin = true;
                //console.log('getUserInfo成功');
                that.getUserInfo(res);
              }, 
              fail: (res) => {
                console.log('getUserInfo失败');
              },
            });
          },
          fail: (res) => {
            console.log('code2session失败');
            console.log(res);
          },
        });
      },
      fail(res) {
        console.log('login调用失败 ' + res.errMsg);
      },
    });
    setTimeout(() => {
      app.userName = that.data.userName;
      app.userName = that.data.userName;
      app.userInfo.userName = that.data.userName;
      app.userInfo.headUrl = that.data.headUrl;
      app.userInfo.phone = that.data.phone;
      app.userInfo.age = that.data.age;
      app.userInfo.gender = that.data.gender;
      //console.log(this.data.phone);
    }, 1000);
    
  },
  getUserInfo: function (res) {
    var that = this;
    this.setData({
      headUrl: res.userInfo.avatarUrl,
      userName: res.userInfo.nickName,
      isLogin: true
    });
    tt.request({
      url: encodeURI(app.backendIndex + 'getUserInfo?openid=' + this.data.openid + '&userName=' + res.userInfo.nickName), // 目标服务器url
      success: (res) => {
        //console.log(res);
        that.setData({
          userName: res.data.nickName,
          phone: that.phoneMask(res.data.phone),
          gender: res.data.gender,
          age: res.data.age,
          storage: '>'
        });
      },
      fail: (res) => {  
        console.log(res);
        that.setData({
          phone: '获取数据失败',
          gender: '获取数据失败',
          age: '获取数据失败',
          storage: '获取数据失败'
        });
      }
    });
    
  },
  phoneMask: function (ph) {
    if (/.*[\u4e00-\u9fa5]+.*$/.test(ph)) return ph;
    var prefix = ph.slice(0, 3), suffic = ph.slice(-4);
    var leng = ph.length;
    var stars = '';
    for (var i = 0; i < leng-7; i++) stars += '*';
    return prefix + stars + suffic;
  },
  changeNameTap: function (event) {
    if (this.data.isLogin) {
      tt.navigateTo({
        url: '/pages/changeName/changeName' // 指定页面的url
      });
    }
  },
  changeAgeTap: function (event) {
    if (this.data.isLogin) {
      tt.navigateTo({
        url: '/pages/changeAge/changeAge' // 指定页面的url
      });
    }
  },
  changeGenderTap: function (event) {
    if (this.data.isLogin) {
      tt.navigateTo({
        url: '/pages/changeGender/changeGender' // 指定页面的url
      });
    }
  },
  changePhoneTap: function (event) {
    if (this.data.isLogin) {
      tt.navigateTo({
        url: '/pages/changePhone/changePhone' // 指定页面的url
      });
    }
  },
  storageTap: function (event) {
    if (app.isLogin) {
      tt.navigateTo({
        url: '/pages/travel-storage/travel-storage' // 指定页面的url
      });
    }
  },
  exitTap: function (event) {
    app.isLogin = false;
    this.setData({
      headUrl: "",
      openid: "",
      userName: "未登录",
      isLogin: false,
      phone: "未登录",
      gender: '未登录',
      age: '未登录',
      storage: '未登录'
    });
    app.userName = 'general';
    app.openid = '';
    app.userInfo.headUrl = '';
    app.userInfo.userName = 'general';
    app.userInfo.age = '';
    app.userInfo.gender = '';
    app.userInfo.phone = '';
  }
})
App({
  onLaunch: function () {

  },

  userInfo: {
    headUrl: '',
    userName: 'general',
    phone: '',
    gender: '',
    age: ''
  },

  author: "Lida Guo",
  backendIndex: 'http://192.168.3.9:8080/', // 需要根据后端自行设置
  imageFolder: "/Users/mac/Documents/Study/Research/字节跳动字学镜像计划/DaDa/pic/",
  searchResults: {nodes: [], strategies: []},
  isLogin: false,
  userName: 'general',
  openid: '',
  searchOpenid: '',
  currentNode: '',
  currentStrategy: '',
  tmpFiles: []
})

export default defineAppConfig({
  pages: [
    "pages/shopping/index",
    "pages/app-auth/index",
    // "pages/search/index",
    // "pages/book-detail/index",
    "pages/index/index",
    "pages/userCenter/index",
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    enablePullDownRefresh: true
  },
  tabBar: {
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "./assets/tab_home.png",
        selectedIconPath: "./assets/tab_home_f.png"
      },
      {
        pagePath: "pages/shopping/index",
        text: "商城",
        iconPath: "./assets/tab_me.png",
        selectedIconPath: "./assets/tab_me_f.png"
      },
      {
        pagePath: "pages/userCenter/index",
        text: "我的",
        iconPath: "./assets/tab_me.png",
        selectedIconPath: "./assets/tab_me_f.png"
      }
    ],
    color: "#a6a6a6",
    selectedColor: "#78a4fa",
    backgroundColor: "#ffffff",
    borderStyle: "black"
  }
})
let app = getApp();
const util = require("../../../utils/util.js");
Page({
  data: {
    navigateTitle: "",
    movieArr: {},
    requestUrl: "",      // 在data里面将请求URL存储起来
    totalCount: "",
    isEmpty: ""          // 判断电影数据是否为空
  },
  onLoad: function (options) {
    let movieTitle = options.movieTitle;   // 接收传过来的参数
    let httpUrl = "";
    this.data.navigateTitle = movieTitle;
    switch (movieTitle) {
      case "热映镑":
        httpUrl = app.globalData.doubanHttp + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        httpUrl = app.globalData.doubanHttp + "/v2/movie/coming_soon";
        break;
      case "Top250":
        httpUrl = app.globalData.doubanHttp + "/v2/movie/top250";
        break;
      default:
        httpUrl = "";
        break;
    }
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle    // 设置标题
    });
    this.data.requestUrl = httpUrl;     // 将url存储起来
    util.http(httpUrl, this.processDoubanData)  // 留有一个回调函数
  },
  onScrollLower(event) {    // 到底部就触发
    let nextUrl = this.data.requestUrl + "?start=" +   this.data.totalCount + "&count=20";  // 每次获取20条数据
    util.http(nextUrl, this.processDoubanData )
    wx.showNavigationBarLoading();  // 展示导航条显示动画
  },
  onPullDownRefresh(event){       // 下拉刷新时触发事件
     let refreshUrl = this.data.requestUrl+"?start=0&count=20";
     this.data.movieArr = {};   // 清空原有的数据
     this.data.isEmpty = true;
     this.data.totalCount = 0;
     util.http(refreshUrl, this.processDoubanData);
     wx.showNavigationBarLoading();  
  },
  processDoubanData(data) {
    let movieArr = [];
    for (let index in data.subjects) {
      let subject = data.subjects[index];
      let title = subject.title;
      if (title.length > 6) {
        // 判断名称长度并进行截取
        title = title.substring(0, 6) + "...";
      }
      let temp = {     // 创建一个临时对象
        starts: util.convertStarts(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        largeUrl: subject.images.large,
        movieId: subject.id
      }
      movieArr.push(temp)
    }
    // 存放数据的对象,绑定新数据之前要和原有的数据进行合并
    let moviesData = {};
    if (!this.data.isEmpty) {
      moviesData = Array.from(this.data.movieArr).concat(movieArr);
    } else {
      moviesData = movieArr;
      this.data.isEmpty = false;
    }
    this.setData({
      movieArr: moviesData   // 讲电影数据绑定到data里面
    })
    this.data.totalCount += 20;   // 每次向后获取20条数据
    wx.hideNavigationBarLoading();  // 隐藏导航条显示动画
    wx.stopPullDownRefresh()     // 停止下拉刷新加载数据
  },
  onReady(event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle   // 页面准备完毕就加载标题
    })
  }
})
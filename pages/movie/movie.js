const util = require("../../utils/util.js");
let app = getApp();
Page({
   //页面的初始数据
  data: {
    hotMovies:{},
    top250:{},
    scoreMovies:{},
    showMovie: true,
    searchShow: false,
    searchMovie: {}
  },
  onLoad: function (options) {
    /****************************************************************/
    // 获取豆瓣上的公共api，暂时不能用
      let hotMoviesUrl = app.globalData.doubanHttp    
          +"/v2/movie/in_theaters"+"?start=0&count=3";   // 每次获取三条数据
      let comingMovieUrl = app.globalData.doubanHttp
        +"/v2/movie/coming_soon"+"?start=0&count=3";
      let topUrl = app.globalData.doubanHttp+"/v2/movie/top250" + "?start=0&count=3"; 
      this.getMovieDataList(hotMoviesUrl,"hotMovies","热映镑");
      this.getMovieDataList(comingMovieUrl, "scoreMovies", "即将上映");
      this.getMovieDataList(topUrl, "top250", "Top250");

  /****************************************************************/
    // 获取时光网上的资讯，按地区来
    // let hotMoviesUrl = app.globalData.mtimeHttp +"/PageSubArea/HotPlayMovies.api?         locationId=670";
    // let newMoviesUrl = app.globalData.mtimeHttp + "/Movie/MovieComingNew.api?             locationId=670";
    // let sellingMoviesUrl = app.globalData.mtimeHttp +                      "/PageSubArea/HotPlayMovies.api?locationId=670";
    // this.getMovieDataList(hotMoviesUrl, "hotMovie", "热映榜");
  },
  moreMovie(event){
    let movieTitle = event.currentTarget.dataset.movietitle;  // 接收传过来的参数
    wx.navigateTo({
      url: 'more-movie/more-movie?movieTitle=' + movieTitle
    })
  },
  getMovieDataList:function (urls,keys,movieTitle){
    wx.request({
      url: urls,
      method: 'GET', 
      header: {
        "Content-Type": "json"
      },
      success: res => {
        // console.log( res.data );
        this.processData(res.data, keys, movieTitle);
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  processData(data,keys,movieTitle){
    let movieArr = [];
    for (let index in data.subjects){
       let subject = data.subjects[index];
       let title =  subject.title;
       if(title.length>6){
         // 判断名称长度并进行截取
          title = title.substring(0,6)+"..."; 
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
    console.log( movieArr );
    let readyData = {};   // 存放数据的对象
    readyData[keys] = {
      movieTitle: movieTitle,
      movieArr: movieArr
    }
    this.setData( readyData );  // 动态存放数据
  },
  onClear(event){
    this.setData({
      searchMovie:{},
      showMovie: true,
      searchShow:false
    })
  },
  onBindfocus(event){
    this.setData({
      showMovie:false,
      searchShow: true
    })
  },
  onBindblur(event){
    let text = event.detail.value    // 获取文本框输入的值
    let searchUrl = app.globalData.doubanHttp +"/v2/movie/search?q="+text;
    this.getMovieDataList(searchUrl,"searchMovie","");
  },
  onMovieDetail(event){
    let id = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+id
    })
  }
})
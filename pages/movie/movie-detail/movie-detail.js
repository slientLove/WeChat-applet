// pages/movie/movie-detail/movie-detail.js
import {Movie} from "class/Movie.js"  // 要引入
let app = getApp();    // 加载全局变量
Page({
  data: {
     movie:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let movieId = options.id;    // 接收传过来的电影id
    let loadUrl = app.globalData.doubanHttp
      + "/v2/movie/subject/" + movieId;
    let movie = new Movie( loadUrl );  // 实例化一个对象
    movie.getMovieData( movies => {
      this.setData({
        movie: movies      // 进行数据绑定
      })
    })
  },

})
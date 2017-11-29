const util = require("../../../../utils/util.js");
class Movie{
  constructor(url){
     this.url = url      // 初始化一个对象
  }
  getMovieData(callback){
    this.callback = callback;
    util.http(this.url, this.processDoubanData.bind(this))
  }
  processDoubanData( data ){
     if(!data){
       return;   // 先判断有没有数据
     }
     let directors = {      // 进行简单的判断
       avatars:"",
       name:"",
       id:""        
     }
     if (!data.directors[0]!=null){
       if (!data.directors[0].avatars!=null){
          directors.avatars = data.directors[0].avatars.large;
       }
       directors.name = data.directors[0].avatars.name;
       directors.id = data.directors[0].avatars.id;
     }
     let movies = {
       movieImg: data.images ? data.images.large:"",
       title: data.title,
       country: data.countries[0],
       year: data.year,
       originalTitle: data.original_title,
       wishCount: data.wish_count,
       commentCount: data.comments_count,
       generes: data.genres.join(","),
       starts: util.convertStarts( data.rating.stars ),  // 对数据进行处理
       score: data.rating.average,
       casts: util.convertToCastString(data.casts),
       directors: util.convertToCastString(data.directors),
       castsInfo: util.convertToCastInfos(data.casts),
       summary: data.summary
       // 暂时好像没找到电影的简介
     }
     this.callback(movies);
  }
}
export {Movie}
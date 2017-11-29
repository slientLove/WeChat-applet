// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

// 依据评价数展示星星数量
const convertStarts = starts => {
    let num = starts.toString().substring(0,1);  // 取整数
    let arr = [];
    for(let i=0;i<=5;i++){            // 只有5颗星星
      if(i<num){
          arr.push(1);
      }else{
        arr.push(0);
      }
    }
   return arr;            // 返回一个数组
}
function convertToCastString( casts ){
   let castString = "";
   for(let index in casts){
     castString = castString+casts[index].name+"/";
   }
   return castString.substring(0,castString.length-2 );  // 去掉后面的"/"
}
function convertToCastInfos(casts){
  let castsArr = [];
  for( let index in casts){
     let cast = {
       img: casts[index].avatars ? casts[index].avatars.large:"",
       name: casts[index].name
     }
     castsArr.push(cast)
  }
  return castsArr;   // 将结果返回
}
// 提取请求函数
function http(urls,callback){
  wx.request({
    url: urls,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: res => {
      callback(res.data)
    },
    fail: function (error) {
      console.log(error)
    }
  })
}
module.exports = {
  http:http,
  convertStarts: convertStarts,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}

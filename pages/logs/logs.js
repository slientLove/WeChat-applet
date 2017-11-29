//logs.js
const util = require('../../utils/util.js')
const dataList = require("../../data/posts-data.js");
Page({
  data: {
  },
  onLoad: function () {
    this.setData({
      postList:dataList.postList
    })
  },
  ontap(event){
    let dataid = event.currentTarget.dataset.id;  // 接收传过来的id值
    wx.navigateTo({
      url:"logs-detail/logsDetail?id="+dataid
    });
  },
  onSwiper(event){
     // 此处target表示事件发生的元素，而currenttarget表示事件捕获的元素，也
     // 就是swiper,只有images元素上有id
     let logsId = event.target.dataset.id;
     wx.navigateTo({
       url: 'logs-detail/logsDetail?id='+logsId
     })
  }
})

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
  }
})

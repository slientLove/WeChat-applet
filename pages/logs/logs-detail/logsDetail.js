const dataList = require("../../../data/posts-data.js");
const app = getApp()   // getApp()获取全局变量
Page({
  /**
   * 页面的初始数据
   */
  data: {
     isPlay:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){   
    let dataId = options.id;   // options接收从另一个页面传过来的值
    this.data.dataId = dataId;  // 将数据放到data里面，进行去全局共享
    const logsData = dataList.postList[dataId];  // 根据id进行查找数据
    this.setData({
      logsData: logsData
    })
    // 进行缓存的处理 
    let logsId = wx.getStorageSync(dataId);  // 判断缓存里是否有数据
    if(logsId){
      let isCollected = logsId[dataId];  // 根据id号查找数据
      console.log(isCollected);
      this.setData({
        isCollected: isCollected         // 根据是否有缓存，动态加载不同图片      
      })
    }else{
      let logsId = {};
      logsId[dataId] = false;
      wx.setStorageSync(dataId, logsId);
    }
    
    // 进行音乐的处理
    if (app.globalData.isPlayingMusic && app.globalData.global_currenId==dataId){
        this.setData({   // 判断当前页面音乐播放状态，因为微信外面有个总控开关
          isPlay:true
        })
    }
    this.setGlobalMusic();    // 可以全局控制音乐的播放
  },
  setGlobalMusic(){
      let pages = getCurrentPages();   // 利用getCurrentPages栈获取当前页面
      let currentPages = pages[pages.length-1]    // 获取当前页面
      // 处理监听到的播放事件
      wx.onBackgroundAudioPlay( event => {
        console.log(currentPages);
        if( currentPages.data.dataId==this.data.dataId ){
          if ( app.globalData.global_currenId==this.data.dataId ){
              this.setData({
                isPlay: true
              });
          }
        }
        app.globalData.isPlayingMusic = true;
      });
      // 处理监听到的暂停事件
      wx.onBackgroundAudioPause( event => {
        if (currentPages.data.dataId == this.data.dataId) {
          if (app.globalData.global_currenId == this.data.dataId) {
            this.setData({
              isPlay: false
            });
          }
        }
        app.globalData.isPlayingMusic = false;
      });
      // 处理监听到的停止事件
      wx.onBackgroundAudioStop( event => {
         this.setData({
           isPlay:false
         });
         app.globalData.isPlayingMusic = false;
      })
  },
  onCollection(event) {
    let that = this;
    that.getCollected();
  },
  // 同步方法
  getCollected(){
    let that = this;
    let logsCollect = wx.getStorageSync(this.data.dataId);
    console.log(JSON.stringify(logsCollect));
    let isCollect = logsCollect[this.data.dataId];
    console.log(isCollect);
    isCollect = !isCollect;     // 取反向，收藏变为不收藏
    this.setData({
      isCollected: isCollect    // 更新data里面的数据
    })
    let logsId = {};            // 对缓存里面的值进行重新赋值
    logsId[this.data.dataId] = isCollect;
    wx.setStorageSync(this.data.dataId, logsId);
    that.showToast(this.data.dataId, isCollect);
  },
  showToast(checkId, isCollect){
    let isCollected = wx.getStorageSync(checkId);
     isCollected = !isCollected;    // 收藏变为未收藏
     this.setData({
       isCollected: isCollect    // 动态更新data里面的数据
     })
     wx.showToast({
       title: isCollect?"收藏成功":"取消收藏",
       duration: 1000,
       icon: 'success'
     })
  },
  playMusic(){
    let currentId = this.data.dataId;
    let datalist = dataList.postList[currentId];  // 根据id获取数据
    let isPlay= this.data.isPlay;    // 获取音乐播放状态，动态改变图片
    if(isPlay){
      wx.pauseBackgroundAudio();  // 中止音乐的播放
      this.setData({
        isPlay: false
      });
      app.globalData.isPlayingMusic = false;
    }else{
      wx.playBackgroundAudio({
        dataUrl: datalist.music.url,
        title: datalist.music.title
      });
      this.setData({
        isPlay: true
      });
      app.globalData.isPlayingMusic = true;
      app.globalData.global_currenId = this.data.dataId; // 将当前id存储到全局变量中
    }
  }
})
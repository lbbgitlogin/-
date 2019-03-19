// pages/select/select.js
var app = getApp()
var $ = require('../../utils/util.js');
var api = require('../../api/loginAPI.js');
var notice = require('../../utils/notice.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back_sele: 0,
    testnum: "", //商家账号本地缓冲,
    select: "", //一级分类
    siclos: 0,
    index: 0,
    categoryId:"",
    ok: "",
    idshow: 1,
    bindex: 0,
    childcate: "", //erji分类
    select_id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({ //获取本地缓存商家名
      key: "key777",
      success: function(res) {
        console.log("获取商家名", res)
        that.setData({
          testnum: res.data
        });
        wx.getStorage({ //获取本地缓存类目
          key: "IdEntity",
          success: function(res) {
            that.setData({
              truelist: res.data.SId,
              categoryId: res.data.FId
            })
            console.log("选取类目", res)
            var val = {
              userAccount: that.data.testnum, //商家账号    获取一级分类集合 下次使用
            }
            $.xsr($.makeUrl(api.GetVendorBusinessCategory, val), function(data) {
              console.log("一级类目:", data)
              that.setData({
                select: data.Info
              })
              console.log("一级类目集合是否丢失", that.data.select)
              var val = {
                userAccount: that.data.testnum, //商家账号
                categoryId: that.data.categoryId //一级类目上次选择
              }
              $.xsr($.makeUrl(api.GetVendorBusinessChildCategory, val), function (data) {
                console.log("onload获取二级类目", data)
                var list = that.data.select;
                console.log("一级类目集合是否丢失02", list)
                for (var item of list) {

                  if (val.categoryId === item.Id) { //如果对应则data.info 加入 一级类目content

                    item.content = data.Info;
                    that.setData({
                      select_id: item.Id
                    });
                    console.log("idididid：", that.data.select_id)
                  }
                }
                var childlist = data.Info; //获取二级类目
                var truellist = that.data.truelist; //上次缓冲类目
                for (var childrenlist of childlist) { //全二级类目循环
                  for (var truellistt of truellist) { //上次缓冲二级类目
                    if (childrenlist.Id === truellistt) {
                      if (childrenlist.checked) {
                        childrenlist.checked = false;
                      } else {
                        childrenlist.checked = true;
                      }
                    }
                  }
                }
                that.setData({
                  select: list,
                });
              });
            });
           
          },
          fail:function(){
            that.select()
          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  select: function() { //获取一级类目


    var val = {
      userAccount: this.data.testnum, //商家账号
    }
    var thisobj = this;
    $.xsr($.makeUrl(api.GetVendorBusinessCategory, val), function(data) {
      thisobj.setData({
        select: data.Info
      })
    });
  },
  selectAddress: function() { //选择二级类目
    var IdEntity = {
      FId: "",
      SId: [],
      fidname: "",
      sidname: []
    }
    var thatList = this.data.select;
    for (var item of thatList) {
      if (item.content) {
        for (var info of item.content) {
          if (info.checked) {
            IdEntity.FId = item.Id;
            IdEntity.fidname = item.Name
            IdEntity.SId.push(info.Id);
            IdEntity.sidname.push(info.Name)
          }
        }
      }
    }
    $.backpage(1, function() {
      notice.postNotificationName("RefreshOrder1", IdEntity);
    });
    console.log("选中类目：", IdEntity);
    wx.setStorage({
      key: "IdEntity",
      data: IdEntity
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  smaller: function(e) {
    var that = this;
    if (that.data.back_sele == 0) {
      that.setData({
        back_sele: 1
      });
    } else {
      that.setData({
        back_sele: 0
      });
    }
  },
  childcate: function(e) { //一级事件
    var that = this;
    var val = {
      userAccount: this.data.testnum, //商家账号
      categoryId: e.currentTarget.dataset.id
    }
    var thisobj = this;
    $.xsr($.makeUrl(api.GetVendorBusinessChildCategory, val), function(data) {
      console.log("erji",data)
      var list = thisobj.data.select;
      for (var item of list) {
        if(item.content){
          item.content=""
        }else{
          if (val.categoryId === item.Id) { //如果对应则data.info 加入 一级类目content
            item.content = data.Info;
            thisobj.setData({
              select_id: item.Id
            });
          }
        }
        
      }
      thisobj.setData({
        select: list,
        siclos: 1
      });

    });

  },




  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  selectCategory: function(e) {
debugger
    var ckId = e.currentTarget.dataset.id;
    var fid = e.currentTarget.dataset.fid;
    var thatList = this.data.select;
    console.log("选择222", thatList)
    for (var item of thatList) {
      if (item.content) {
        if (item.Id === fid) {
          for (var info of item.content) {
            if (info.Id === ckId) {
              if (info.checked) {
                info.checked = false;
              } else {
                info.checked = true;
              }
            }
          }
        } else {
          for (var info of item.content) {
            info.checked = false;
          }
        }
      }
    }
    this.setData({
      select: thatList
    });
  }
})
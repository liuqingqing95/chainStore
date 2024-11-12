import { View, Text, Swiper, SwiperItem, Navigator, Image } from '@tarojs/components'
import util from '@/utils/util'
import api from '@/utils/api'
import './index.scss'
import Taro, { useDidShow, useLaunch, useLoad } from '@tarojs/taro'
import { useState } from 'react'

export default function Index() {
  const [floorGoods, setFloorGoods] = useState([])
  const [autoplay, setAutoPlay] = useState(true)
  const [showContact, setContact] = useState(1)
  const [sysHeight, setSysHeight] = useState(0)
  const [userInfo, setUserInfo] = useState({})
  const [loading, setLoading] = useState(0)
  const [banner, setBanner] = useState<Array<{goods_id:string, link_type: number, link: string, image_url: string}>>([])
  const [notice, setNotice] = useState<Array<{content: string}>>([])
  // openAttr: false,
  // showChannel: 0,
  // showBanner: 0,
  // showBannerImg: 0,
  // banner: [],
  // index_banner_img: 0,
  // userInfo: {},
  // imgurl: '',
  // sysHeight: 0,
  // loading: 0,
  // autoplay:true,
  // showContact:1,
  // useLoad(() => {
  //   console.log('Page loaded.')
  // })
  function onPageScroll(e) {
    let scrollTop = e.scrollTop;
    if (scrollTop >= 2000) {
      setContact(0)
    } else {
      setContact(1)
    }
  } 
// onHide:function(){
//     this.setData({
//         autoplay:false
//     })
// }
  function goSearch() {
      Taro.navigateTo({
          url: '/pages/search/search',
      })
  }
  function goCategory(e) {
      let id = e.currentTarget.dataset.cateid;
      Taro.setStorageSync('categoryId', id);
      Taro.switchTab({
          url: '/pages/category/index',
      })
  }
  // handleTap(event) {
  //     //阻止冒泡 
  // }
  function onShareAppMessage() {
      let info = Taro.getStorageSync('userInfo');
      return {
          title: '海风小店',
          desc: '开源微信小程序商城',
          path: '/pages/index/index?id=' + info.id
      }
  }
  function toDetailsTap() {
      Taro.navigateTo({
          url: '/pages/goods-details/index',
      });
  }
  function getIndexData() {
      util.request(api.IndexUrl).then(function(res) {
        if (res.errno === 0) {
          setLoading(1)
          setFloorGoods(res.data.categoryList)
          setBanner(res.data.banner)
          // setChannel(res.data.channel)
          setNotice(res.data.notice)
              // that.setData({
              //     floorGoods: res.data.categoryList,
              //     banner: res.data.banner,
              //     channel: res.data.channel,
              //     notice: res.data.notice,
              //     loading: 1,
              // });
              let cartGoodsCount = '';
              if(res.data.cartCount == 0) {
                  Taro.removeTabBarBadge({
                      index: 2,
                  })
              } else {
                  cartGoodsCount = res.data.cartCount + '';
                  Taro.setTabBarBadge({
                      index: 2,
                      text: cartGoodsCount
                  })
              }
          }
      });
  }
  useLaunch(() => {
    console.log('onLaunch')
  }) 
  useLoad((options) => {
    console.log(options)
    getChannelShowInfo();
  }) 
  useDidShow(() => {
    console.log('ddd')
    getIndexData();
    let userInfo = Taro.getStorageSync('userInfo');
    if (userInfo != '') {
      setUserInfo(userInfo)
    };
    let info = Taro.getSystemInfoSync();
    let sysHeight = info.windowHeight - 100;
    setSysHeight(sysHeight)
    setAutoPlay(true)
    Taro.removeStorageSync('categoryId');
  }) 
  function getChannelShowInfo() {
    
      util.request(api.ShowSettings).then(function(res) {
        if (res.errno === 0) {
           
            
              // let show_banner = res.data.banner;
              // let show_notice = res.data.notice;
              // let index_banner_img = res.data.index_banner_img;
          setBanner(res.data.banner)
          setNotice(res.data.notice)
   
              // that.setData({
              //     show_channel: show_channel,
              //     show_banner: show_banner,
              //     show_notice: show_notice,
              //     index_banner_img: index_banner_img
              // });
          }
      });
  }
  // onPullDownRefresh() {
  //     Taro.showNavigationBarLoading()
  //     getIndexData();
  //     getChannelShowInfo();
  //     Taro.hideNavigationBarLoading() //完成停止加载
  //     Taro.stopPullDownRefresh() //停止下拉刷新
  // }
  const contract = showContact == 1 ?
    <View className='contact-wrap'>
    <button className="contact-btn" session-from='{"nickName":"{userInfo.nickname}}","avatarUrl":"{{userInfo.avatar}}"}' open-type="contact">
        <Image className='icon' src='/images/icon/contact.png'></Image>
        <View className='text'>客服</View>
    </button>
  </View> : <></>
  const bannerRender = banner.length > 0 ? 
  <View className='banner-wrap' >
      <Swiper className="banner" indicator-dots="true" autoplay={autoplay} interval={3000} duration={1000}   >
        {banner.map(item => 
          <SwiperItem >
            <Navigator url={item.link_type == 0 ? `/pages/goods/goods?id=${item.goods_id}` :
              item.link_type == 1 ? item.link : ''}>
             <Image src={item.image_url} background-size="cover"></Image>
            </Navigator> 
        </SwiperItem>
        )}
    </Swiper>
  </View> : <></>
  const noticeRender = notice.length > 0 ? 
    <View className='marquee_box'>
      <Swiper vertical={true} className="notice-Swiper" indicator-dots={false} autoplay={autoplay} interval={2000} duration={1000}>
        {notice.map(item => 
          <SwiperItem  className='notice-wrap'>
            <View className="icon">
                <Image src="/images/icon/notice-icon.png" className='img'>
                </Image>
            </View>
            <View className='notice-text'>{item.content}</View>

          </SwiperItem>
          )}
      </Swiper>
  </View> : <></>
  const dd= loading ?
    <View className="container">
    {contract}
    <View className="search" onClick={goSearch}>
        <Image className="icon" src="/images/icon/search.png"></Image>
        <text className="txt">搜索,发现更多好物</text>
    </View>
       {bannerRender}
       {noticeRender}
    
    {/* <ad unit-id="adunit-c755904541658aa1" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white"></ad>  */}
    {/* <Swiper className="catalog-wrap" indicator-dots="{{false}}" indicator-color="#dedede" indicator-active-color="#e00000" wx:if="{{show_channel}}">
        <SwiperItem className="first">
            <View wx:for="{{channel}}" wx:if="{{item.sort_order < 7}}" wx:key="id" className='icon-navi' data-cateid="{{item.id}}" onClick={goCategory}>
                <Image className='icon-img' src="{{item.icon_url}}"></Image>
                <View className='icon-text'>{{item.name}}</View>
            </View>
        </SwiperItem>
        <SwiperItem className="first" wx:if="{{channel.length > 6}}">
            <Navigator wx:for="{{channel}}" wx:key="id" hover-className="none" className='icon-navi' url="/pages/category/index?id={{item.id}}" wx:if="{{item.sort_order > 6 && item.sort_order < 12}}">
                <Image className='icon-img' src="{{item.icon_url}}"></Image>
                <View className='icon-text'>{{item.name}}</View>
            </Navigator>
        </SwiperItem>
        <SwiperItem className="first" wx:if="{{channel.length > 11}}">
            <Navigator wx:for="{{channel}}" hover-className="none" className='icon-navi' url="/pages/category/index?id={{item.id}}" wx:if="{{item.sort_order > 10}}">
                <Image className='icon-img' src="{{item.icon_url}}"></Image>
                <View className='icon-text'>{{item.name}}</View>
            </Navigator>
        </SwiperItem>
    </Swiper> */}
    {/* <View className="goods-container">
      
      {floorGoods.map(item =>
        <View className='topic-container' key={item.id}>
            <View className='banner-container' onClick={goCategory} data-cateid="{{item.id}}" wx:if="{{index_banner_img == 1}}">
                <Image mode='aspectFill' style="width:100%;height:{{item.height}}rpx" src='{{item.banner}}'>
                </Image>
                <View className="bg" style="height:{{item.height}}rpx;line-height:{{item.height}}rpx;"></View>
                <View className="text" style="height:{{item.height}}rpx;line-height:{{item.height}}rpx;">{{item.name}}</View>
            </View>
            <View wx:else className="category-title" data-cateid="{{item.id}}" onClick="goCategory">
                <View className="title">
                    <View className="text">{{item.name}}</View>
                    <View className="line"></View>
                </View>
            </View>
            <View className='list-wrap clearfix'>
                <View className="new-box {{(iindex+1)%3 == 0?'no-margin':''}}" wx:for="{{item.goodsList}}" wx:for-index="iindex" wx:for-item="iitem" wx:key="id">
                    <Navigator hover-className='none' className='navi-url' url="/pages/goods/goods?id={{iitem.id}}">
                        <View className="box">
                            <Image src="{{iitem.list_pic_url}}" className="image">
                                <View wx:if="{{iitem.is_new == 1}}" className='new-tag'>新品</View>
                            </Image>
                            <block wx:if="{{iitem.goods_number <= 0}}">
                                <View className='sold-img'>
                                    <Image className='soldout' src='/images/icon/sold-out.png'></Image>
                                </View>
                            </block>
                        </View>
                        <View className="goods-info {{iitem.goods_number <= 0?'fast-out-status':''}}">
                            <View className="goods-title">{{iitem.name}}</View>
                            <View className='price-container'>
                                <View className='l'>
                                    <View className='h'>￥{{iitem.min_retail_price}}</View>
                                </View>
                            </View>
                        </View>
                    </Navigator>
                </View>
            </View>
            <View className="more-category" data-cateid="{{item.id}}" onClick="goCategory">点击查看更多{{item.name}}</View>
        </View>)}
       
    </View> */}
    {/* <ad unit-id="adunit-b6fcdb43b7913591"></ad>  */}
    <View className="no-more-goods ">没有更多商品啦</View>
   </View> :
      <View className="loading" style="height:{{sysHeight}}px" >
        <Image className="img" src="/images/icon/loading.gif"></Image>
        <View className="text">海风吹啊吹</View>
      </View>
 
   return <>222{dd}</> 
}

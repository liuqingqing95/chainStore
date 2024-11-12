import { View, Text, Image } from '@tarojs/components'
import Taro, { useDidShow, useLoad } from '@tarojs/taro'
import './index.scss'
import { useState } from 'react'
import util from '@/utils/util'

export default function Index() {
  const [hasUserInfo, setHasInfo] = useState(false)
  const [userInfo, setUserInfo] = useState<{nickname?: string, avatar?: string}>({})
  function goAuth(e) {
    Taro.navigateTo({
      url: '/pages/app-auth/index',
    });
  }

  function goProfile(e) {
    let res = util.loginNow();
    if (res == true) {
        Taro.navigateTo({
            url: '/pages/userCenter/settings/index',
        });
    }
  }
  useLoad(() => {
    console.log('Page loaded.')
  })
  useDidShow(() => {
    let userInfo = Taro.getStorageSync('userInfo');
    if(userInfo == ''){
        setHasInfo(false);
    }
    else{
      setHasInfo(true);
    }
    setUserInfo(userInfo);
    // getOrderInfo();
    Taro.removeStorageSync('categoryId');
  })
  return (
    <View className="container">
      <View className="userinfo">
        {
          hasUserInfo == false ? <View className='head-wrap' onClick={goAuth}>
            <View className="no-login-avatar">
                <View className='no-avatar'>
                    <Image className='avatar' src="/images/icon/default_avatar_big.png"></Image>
                </View>
                <View className='btn-login'>点我登录</View>
            </View>
          </View> :
          <View className='head-wrap' onClick={goProfile}>
            <View className="head-l">
                <View className='l'>
                    <Image className='avatar' src={userInfo.avatar || ''}></Image>
                </View>
                <View className='r'>
                    <View className='t'>
                        <View className='name'>{userInfo.nickname}</View>
                    </View>
                </View>
            </View>
            <View className="head-r">
                <View className="arrow"></View>
            </View>
          </View> 
        }
        </View>
    </View>
  )
}

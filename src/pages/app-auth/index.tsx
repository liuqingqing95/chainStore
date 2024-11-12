import { View, Text, Button, Image } from '@tarojs/components'
import Taro, { useDidShow, useLoad } from '@tarojs/taro'
import './index.scss'
import { useState } from 'react'
import util from '@/utils/util'
import api from '@/utils/api'

export default function Index() {
  //获取应用实例
  const App = Taro.getApp()
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
  useDidShow(()=> {
      let userInfo = Taro.getStorageSync('userInfo');
      console.log(userInfo, 'userInfo')
    if (userInfo != '') {
        Taro.navigateBack();
    };
  }) 
  useLoad(() => {
    console.log('Page loaded.')
  })
  function getUserProfile() {
    // Taro.navigateTo({
    //     url: '/pages/app-auth/index',
    // });
 
    let code = '';
    Taro.login({
        success: (res) => {
            code = res.code;
        },
         // 失败回调
         fail: (e) => {
            // 弹出错误
            App.showError(e);
        }
    });
    Taro.getSystemInfo({
        success: (res) => {
            if (util.compareVersion(res.SDKVersion, '2.10.4')) {
                // 获取用户信息
                Taro.getUserProfile({
                    lang: 'zh_CN',
                    desc: '用户登录',
                    success: (res) => {
                        let loginParams = {
                            code: code,
                            encryptedData: res.encryptedData,
                            iv: res.iv,
                            rawData: res.rawData,
                            signature: res.signature
                        };
            console.log(loginParams);
                        postLogin(loginParams);
                    },
                    // 失败回调
                    fail: () => {
                        // 弹出错误
                        App.showError('已拒绝小程序获取信息');
                    }
                });
            }
        }
    })

    
}
function postLogin(info) {
    util.request(api.AuthLoginByWeixin, {
        info: info
    }, 'POST').then(function (res) {
        console.log(res);
        if (res.errno === 0) {
            Taro.setStorageSync('userInfo', res.data.userInfo);
            Taro.setStorageSync('token', res.data.token);
            App.globalData.userInfo = res.data.userInfo;
            App.globalData.token = res.data.token;
            let is_new = res.data.is_new; //服务器返回的数据；
            console.log(is_new);
            if (is_new == 0) {
                util.showErrorToast('您已经是老用户啦！');
                Taro.navigateBack();
            } else if (is_new == 1) {
                Taro.navigateBack();
            }
        }
    });
}
function goBack() {
    Taro.navigateBack();
}
  return (
    <View className="container">
        <View className='logo'>
            <Image className='logo-img' src='/images/icon/loading.gif'></Image>
        </View>
        <View className='logo-name'>海风小店</View>
        <View className='intro'>开源微信小程序商城</View>
        <View className='login'>请完成微信授权以继续使用</View>
        
        <Button className='btn-login' onClick={getUserProfile}>
            <View className='img-w'></View>
            <View className='text'>微信快捷登录</View>
        </Button>

        <View className="cancel" onClick={goBack}>取消</View>
    </View>
  )
}

import { View, Text, Button, Label } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'
import { useState } from 'react'
import util from '@/utils/util'
import Api from '@/utils/api'
import {Form, Input} from "@tarojs/components";
export default function Index() {
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  useLoad(() => {
    console.log('Page loaded.')
  })
  function saveStoreMsg() {
    util.request(Api, {
      address,
      name
    }, 'post').then(res => {
      console.log(res)
    })
  }
  function formSubmit(e) {
    console.log(e)
  }

  function onKeyInput(e) {
    console.log(e.target.value)
  }

  return (
    
    <View className='index'>
      <Form  onSubmit={formSubmit} >
        <Label for='address'>地址：</Label>
        <Input type='text' name='address' />
        <Label for='name'>店名：</Label>
        <Input type='text' name='name' />
        <Button form-type='submit'>保存</Button>
      </Form>
      
    </View>
  )
}

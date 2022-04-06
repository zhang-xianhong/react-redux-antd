import React, { useState, useEffect } from 'react'

import { Card, Input, Button, Spin, message } from 'antd'
import { UserOutlined, KeyOutlined } from '@ant-design/icons'

import axios from 'axios'
import servicePath from '../config/apiUrl'

import 'antd/dist/antd.css'
import '../static/css/login.css'

export default function Login(props) {

    const [userName,setUserName] = useState('')
    const [password,setPassword] = useState('')
    const [isLoading,setIsLoading] = useState(false)

    // useEffect(()=>{

    // },[])

    const checkLogin = () => {
        setIsLoading(true)
        if(!userName) {
            message.error('用户名不能为空')
            return false
        } else if(!password) {
            message.error('密码不能为空')
            return false
        }
        let dataProps = {
            'userName': userName,
            'password': password
        }
        axios({
            method: 'post',
            url: servicePath.checkLogin,
            data: dataProps,
            withCredentials: true //前后端共享session
        }).then(res => {
            setIsLoading(false)
            console.log('测试登录111')
            if(res.data.data === '登录成功') {
                localStorage.setItem('openId',res.data.openId)
                props.history.push('/index')
                console.log('登录成功222')
            } else {
                message.error('用户名或密码错误！')
            }
        }).catch(err => {
            console.log('出错了')
        })
        setTimeout(() => {
            setIsLoading(false)
        },500)
    }

    return (
        <div className="login-div">
            <Spin tip="Loading......" spinning={isLoading}>
                <Card title="Blog System" bordered={true} style={{width: 400,textAlign:'center'}}>
                    <Input id="userName" size="large" placeholder="Enter your userName" 
                    prefix={<UserOutlined style={{color:'rgba(0,0,0,.25)'}} />}
                    onChange = {(e) => {setUserName(e.target.value)}}  
                    />
                    <br/><br/>
                    <Input.Password id="password" size="large" placeholder="Enter your password" 
                    prefix={<KeyOutlined style={{color:'rgba(0,0,0,.25)'}} />}
                    onChange = {(e) => {setPassword(e.target.value)}}  
                    />
                    <br/><br/>
                    <Button type="primary" size="large" block onClick={checkLogin} > Login in </Button>
                </Card>
            </Spin> 
        </div>
    )
}

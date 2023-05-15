import React, { useState } from 'react'
import { Input, Button, notification } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
const LoginForm = () => {
  const [toast, toastHolder] = notification.useNotification();
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
    loading: false,
  })

  const submitHandler = async () => {
    setLoginInfo({...loginInfo, loading: true})
    const response = await axios.post('http://localhost:5000/api/auth/login', loginInfo)
    setLoginInfo({...loginInfo, loading: false})

    toast.open({
      message: "Thông báo",
      description: response.data.message,
      icon: (
        <CheckCircleOutlined 
          style={{
            color: '#00FF7F',
          }}
        />
      ),
    })

    if(response.data.success) {
      localStorage.setItem('accessToken', 'myVarValue');
    }
  }

  return (
    <div className="flex gap-2 flex-col my-[40px]">
      <div className="">
        <span className="">Email Address </span>
        <span className="text-red-500 font-bold">*</span>
      </div>
      <div className="">
        <Input
          type="text"
          placeholder="Email"
          value={loginInfo.email}
          onChange={(event) => setLoginInfo({ ...loginInfo, email: event.target.value })}
        />
      </div>
      <div className="">
        <span className="">Password </span>
        <span className="text-red-500 font-bold">*</span>
      </div>
      <div className="">
        <Input.Password
          type="text"
          placeholder="Password"
          value={loginInfo.password}
          onChange={(event) => setLoginInfo({ ...loginInfo, password: event.target.value })}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </div>
      <div className="rounded-md overflow-hidden">
        <Button type="primary" block loading={loginInfo.loading} onClick={() => submitHandler()}>Login</Button>
      </div>
      {toastHolder}
    </div>
  )
}

export default LoginForm
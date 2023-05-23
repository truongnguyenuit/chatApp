import React, { useState } from 'react'
import { Input, Button, notification } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {
  const navigate = useNavigate()
  const [toast, toastHolder] = notification.useNotification();
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const submitHandler = async () => {
    try {
      setLoading(true)
      const response = await axios.post(`http://localhost:5000/api/auth/login`, loginInfo)
      
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

      localStorage.setItem("userInfo", JSON.stringify(response.data));

      setLoading(false)

      try {
        await navigate("/chat");
      } catch (error) {
        console.error(error);
      }

    } catch (error) {

      setLoading(false)
      console.log("hehe", error)
      toast.open({
        message: "Thông báo",
        description: error.response.data.message,
        icon: (
          <CheckCircleOutlined
            style={{
              color: '#00FF7F',
            }}
          />
        ),
      })
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
        <Button type="primary" block loading={loading} onClick={() => submitHandler()}>Login</Button>
      </div>
      {toastHolder}
    </div>
  )
}

export default LoginForm
import React, { useState } from 'react'
import { Input, Button, notification } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined} from '@ant-design/icons';
import axios from 'axios';

const RegisterForm = (navbar) => {
  console.log(navbar)
  const [toast, toastHolder] = notification.useNotification();

  const [registerInfo, setRegisterInfo] = useState({
    name: '',
    email: '',
    confirmPassword: '',
    password: '',
    pic: '',
    loading: false
  })

  const submitHandler = async () => {
    setRegisterInfo({ ...registerInfo, loading: true })
    const response = await axios.post('http://localhost:5000/api/auth/register', registerInfo)
    setRegisterInfo({ ...registerInfo, loading: false })

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
 
    if(response.success) {
      navbar(true)
    }
  }

  return (
    <div className="flex flex-col my-[30px] gap-2">
      <div className="">
        <div className="">
          <span className="">Name </span>
          <span className="text-red-500 font-bold">*</span>
        </div>
        <div className="">
          <Input
            type="text"
            placeholder="Name"
            value={registerInfo.name}
            onChange={(event) => setRegisterInfo({ ...registerInfo, name: event.target.value })}
          />
        </div>
      </div>
      <div className="">
        <div className="">
          <span className="">Email Address </span>
          <span className="text-red-500 font-bold">*</span>
        </div>
        <div className="">
          <Input
            type="text"
            placeholder="Username"
            value={registerInfo.email}
            onChange={(event) => setRegisterInfo({ ...registerInfo, email: event.target.value })}
          />
        </div>
      </div>
      <div className="">
        <div className="">
          <span className="">Password </span>
          <span className="text-red-500 font-bold">*</span>
        </div>
        <div className="">
          <Input.Password
            type="text"
            placeholder="Password"
            value={registerInfo.password}
            onChange={(event) => setRegisterInfo({ ...registerInfo, password: event.target.value })}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </div>
      </div>
      <div className="">
        <div className="">
          <span className="">Confirm Password </span>
          <span className="text-red-500 font-bold">*</span>
        </div>
        <div className="">
          <Input.Password
            type="text"
            placeholder="Confirm password"
            value={registerInfo.confirmPassword}
            onChange={(event) => setRegisterInfo({ ...registerInfo, confirmPassword: event.target.value })}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </div>
      </div>
      <div className="">
        <div className="">
          <span className="">Picture </span>
          <span className="text-red-500 font-bold">*</span>
        </div>
        <div className="">
          <Input
            type="text"
            placeholder="Picture"
            value={registerInfo.pic}
            onChange={(event) => setRegisterInfo({ ...registerInfo, pic: event.target.value })}
          />
        </div>
      </div>

      <div className="rounded-md overflow-hidden">
        <Button type="primary" block loading={registerInfo.loading} onClick={() => submitHandler()}>Register</Button>
      </div>
      {toastHolder}
    </div>
  )
}

export default RegisterForm
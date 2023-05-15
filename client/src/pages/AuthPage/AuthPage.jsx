import React, { useState } from 'react'
import backgroundImage from '../../image/background.png'
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import { Button } from 'antd'
const AuthPage = () => {
  const [navbar, setNavbar] = useState(true)

  return (
    <div className='h-screen w-screen bg-no-repeat bg-cover bg-center flex justify-center' style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className='w-1/3 mt-[30px] flex gap-3 flex-col'>

        <div className='bg-white flex justify-center items-center p-[20px] rounded'>
          <span className='text-3xl'>Talk-A-Tive</span>
        </div>

        <div className='bg-white rounded justify-center items-center flex flex-col p-[15px] '>

          <div className=" flex flex-row w-full items-center justify-around">
            <div className='flex-1 flex justify-center items-center p-[7px] rounded-full'>
              <Button type="primary" ghost block onClick={() => setNavbar(true)}>
                Login
              </Button>
            </div>
            <div className=' flex-1 flex justify-center items-center p-[7px] rounded-full'>
              <Button danger block onClick={() => setNavbar(false)}>
                Register
              </Button>
            </div>
          </div>

          <div className="w-4/5">
            {navbar ? <LoginForm /> : <RegisterForm navbar={navbar} />}

          </div>

        </div>

      </div>
    </div>
  )
}

export default AuthPage
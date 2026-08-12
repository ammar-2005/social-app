import React, { useState } from 'react';
import { Input, Button } from "@heroui/react";
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
  

let loginSchema = zod.object({
  email: zod.string().nonempty('Email is required').email('Invalid Email'),
  password: zod.string().nonempty('Password Required').regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}/, 'Invalid Password'),
})

export default function Logo() {
   const [isLoading , setisLoading] = useState(false)
   let navigate = useNavigate()
   const [apiError , setapiError] = useState(null)
   const [showPassword, setShowPassword] = useState(false)

  let {setUserToken}= useContext(AuthContext) 

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
    resolver: zodResolver( loginSchema)
  });

  function onSubmit(data) {
    console.log(data);
    setisLoading(true)
    axios.post('https://route-posts.routemisr.com/users/signin' , data)
    .then((response) => {
       console.log(response.data);
       if(response.data.message === 'signed in successfully'){
        console.log(response.data.data.token)
  setUserToken( response.data.data.token) 
        localStorage.setItem('token' , response.data.data.token)
         navigate('/home')

       }

    })
   .catch((error) =>  {
  console.log(error.response.data.message);
    setapiError(error?.response?.data?.message || 'حدث خطأ، حاول مرة أخرى');
})
.finally(() => {
   setisLoading(false)
})

  }

  return (
    <div className="bg-gray-50 min-h-screen p-3 flex items-center justify-center">
      <div className="w-full max-w-md">

        {/* Logo linking home */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-6 group">
         
          <span className="text-xl text-gray-900 font-bold tracking-tight">
                Social
              <span className="text-sky-600">App</span>
          </span>
        </Link>

        <div className="w-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-gray-900 font-bold text-center text-2xl mb-1">
               Welcome Back
          </h2>
          <p className="text-gray-500 text-center text-sm mb-6">
             Sign in to continue
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>

            {/* email */}
            <div>
              <Input
                {...register('email')}
                name="email"
                type="email"
                className="w-full"
                placeholder="Enter your Email"
                variant="bordered"
                startContent={<i className="fa-solid fa-envelope text-gray-400 text-sm" />}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* password */}
            <div>
              <Input
                {...register('password')}
                name="password"
                className="w-full"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                variant="bordered"
                startContent={<i className="fa-solid fa-lock text-gray-400 text-sm" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                  </button>
                }
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        
            </div>

            <Button
              type="submit"
              color="primary"
              disabled={isLoading}
              className="mt-2 rounded-full w-full font-semibold bg-sky-600 hover:bg-sky-700"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin" />
                 Signing in...
                </span>
              ) : 'Submit'}
            </Button>

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 font-medium text-center rounded-xl py-2 px-3 flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-exclamation" />
                {apiError}
              </div>
            )}

          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-600 font-semibold hover:underline">
              Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}
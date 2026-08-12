import React, { useContext, useState } from 'react';
import { Input, Button } from "@heroui/react";
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

let schema = zod.object({
  name: zod.string().nonempty('Name is required').min(4, 'Min 3 Letters').max(8, 'Max 8 Letters'),
  username: zod.string().nonempty('Username is required').min(4, 'Min 3 Letters').max(8, 'Max 8 Letters'),
  email: zod.string().nonempty('Email is required').email('Invalid Email'),
  password: zod.string().nonempty('Password Required').regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}/, 'Invalid Password'),
  gender: zod.string().nonempty('Gender is required'),
  dateOfBirth: zod.coerce.date() 
    .refine((dateVal) => {
      let current = new Date().getFullYear() 
      let year = dateVal.getFullYear()
      let age = current - year 
      return age > 20
    }, 'Age must be greater then 20'),
  rePassword: zod.string().nonempty('rePassword Required')
}).refine((obj) => obj.password === obj.rePassword, {
  path: ['rePassword'],   
  message: "Password is not match"
});

export default function Register() {
   let {setUserToken}= useContext(AuthContext)
   let navigate = useNavigate()
   const [apiError , setapiError] = useState(null)
   const [isLoading , setisLoading] = useState(false)
   const [showPassword, setShowPassword] = useState(false)
   const [showRePassword, setShowRePassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      rePassword: '',
      dateOfBirth: '',
      gender: ''
    },
    mode: 'onBlur',
    resolver: zodResolver(schema)
  });

  function onSubmit(data) {
    console.log(data);
    setisLoading(true)
    // Call API
    axios.post('https://route-posts.routemisr.com/users/signup' , data)
    .then((response) => {
       console.log(response.data);
       if(response.data.message === 'account created'){
        console.log(response.data.data.token)
       setUserToken( response.data.data.token)   
        localStorage.setItem('token' , response.data.data.token)
         navigate('/')

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
    <div className="bg-gray-50 min-h-screen p-3 flex items-center justify-center py-10">
      <div className="w-full max-w-md">

        {/* Logo linking home */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-6 group">
         
          <span className="text-xl text-gray-900 font-bold tracking-tight">
            Social<span className="text-sky-600">App</span>
          </span>
        </Link>

        <div className="w-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-gray-900 font-bold text-center text-2xl mb-1">
             Join Social <span className="text-sky-600">App</span>
          </h2>
          <p className="text-gray-500 text-center text-sm mb-6">
            Create your account in a few steps
          </p>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>

            {/* Personal Info section */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                 Personal Information
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <Input
                    {...register('name')}
                    name="name"
                    className="w-full"
                    placeholder="Enter your name"
                    variant="bordered"
                    startContent={<i className="fa-solid fa-id-card text-gray-400 text-sm" />}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Input
                    {...register('username')}
                    name="username"
                    className="w-full"
                    placeholder="Enter your username"
                    variant="bordered"
                    startContent={<i className="fa-solid fa-at text-gray-400 text-sm" />}
                  />
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                </div>

                <div className="flex gap-4 items-start flex-row justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Date of birth</label>
                    <Input
                      {...register('dateOfBirth')}
                      name="dateOfBirth"
                      type="date"
                      className="block w-full h-10 px-3 border border-gray-300 rounded-md text-sm text-gray-500 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                      variant="bordered"
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div className="flex-1">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                    <select {...register('gender')} id="gender" defaultValue="" className="block w-full h-10 px-3 border border-gray-300 rounded-md text-sm text-gray-500 focus:ring-1 focus:ring-sky-500 focus:border-sky-500">
                      <option value="" disabled>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Account Info section */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                 Account Information
              </p>
             
              <div className="flex flex-col gap-4">
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
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600" tabIndex={-1}>
                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                      </button>
                    }
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <Input
                    {...register('rePassword')}
                    name="rePassword"
                    className="w-full"
                    type={showRePassword ? 'text' : 'password'}
                    placeholder="Enter your rePassword"
                    variant="bordered"
                    startContent={<i className="fa-solid fa-lock text-gray-400 text-sm" />}
                    endContent={
                      <button type="button" onClick={() => setShowRePassword(!showRePassword)} className="text-gray-400 hover:text-gray-600" tabIndex={-1}>
                        <i className={`fa-solid ${showRePassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                      </button>
                    }
                  />
                  {errors.rePassword && <p className="text-red-500 text-sm mt-1">{errors.rePassword.message}</p>}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              color="primary"
              disabled={isLoading}
              className="mt-1 rounded-full w-full font-semibold bg-sky-600 hover:bg-sky-700"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin" />
                    Creating account...
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
          Already have an account?{' '}
          <Link to="/login" className="text-sky-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
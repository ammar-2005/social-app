import React, { useState } from 'react';
import { Input, Button } from "@heroui/react";
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

let passwordRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}/

let changePasswordSchema = zod.object({
  password: zod.string().nonempty('Current password is required'),
  newPassword: zod.string().nonempty('New password is required').regex(passwordRegex, 'Password must contain uppercase, lowercase, number and special character'),
  rePassword: zod.string().nonempty('Please confirm your new password'),
}).refine((obj) => obj.newPassword === obj.rePassword, {
  path: ['rePassword'],
  message: 'Passwords do not match'
});

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      password: '',
      newPassword: '',
      rePassword: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(changePasswordSchema)
  });

  function onSubmit(data) {
    setIsLoading(true)
    setApiError(null)
    setSuccessMessage(null)

    axios.patch('https://route-posts.routemisr.com/users/change-password', {
      password: data.password,
      newPassword: data.newPassword
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      console.log(response.data)
      const newToken = response.data?.data?.token || response.data?.token
      if (newToken) {
        localStorage.setItem('token', newToken)
      }

      setSuccessMessage('Password changed successfully')
      reset()
    })
    .catch((error) => {
      console.log(error)
      setApiError(error?.response?.data?.message || 'Something went wrong, please try again')
    })
    .finally(() => {
      setIsLoading(false)
    })
  }

  return (
    <div className="bg-gray-50 min-h-screen p-3 flex items-center justify-center">
      <div className="w-full max-w-md">

        <Link to="/home" className="flex items-center justify-center gap-2.5 mb-6 group">
          <span className="text-xl text-black font-bold tracking-tight">
            Social<span className="text-sky-600">App</span>
          </span>
        </Link>

        <div className="w-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-gray-900 font-bold text-center text-2xl mb-1">
            Change Password
          </h2>
          <p className="text-gray-500 text-center text-sm mb-6">
            Enter your current and new password
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>

            {/* Current password */}
            <div>
              <Input
                {...register('password')}
                name="password"
                className="w-full"
                type={showPassword ? 'text' : 'password'}
                placeholder="Current Password"
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

            {/* New password */}
            <div>
              <Input
                {...register('newPassword')}
                name="newPassword"
                className="w-full"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New Password"
                variant="bordered"
                startContent={<i className="fa-solid fa-key text-gray-400 text-sm" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    <i className={`fa-solid ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                  </button>
                }
              />
              {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
            </div>

            {/* Confirm new password */}
            <div>
              <Input
                {...register('rePassword')}
                name="rePassword"
                className="w-full"
                type={showRePassword ? 'text' : 'password'}
                placeholder="Confirm New Password"
                variant="bordered"
                startContent={<i className="fa-solid fa-key text-gray-400 text-sm" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowRePassword(!showRePassword)}
                    className="text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    <i className={`fa-solid ${showRePassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                  </button>
                }
              />
              {errors.rePassword && <p className="text-red-500 text-sm mt-1">{errors.rePassword.message}</p>}
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
                  Updating...
                </span>
              ) : 'Update Password'}
            </Button>

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 font-medium text-center rounded-xl py-2 px-3 flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-check" />
                {successMessage}
              </div>
            )}

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 font-medium text-center rounded-xl py-2 px-3 flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-exclamation" />
                {apiError}
              </div>
            )}

          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          <Link to="/profile" className="text-sky-600 font-semibold hover:underline">
            <i className="fa-solid fa-arrow-left mr-1" />
            Back to Profile
          </Link>
        </p>

      </div>
    </div>
  );
}
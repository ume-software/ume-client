import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '~/contexts/auth'

import { Dispatch, SetStateAction } from 'react'

import { trpc } from '~/utils/trpc'

interface AuthFormProps {
  setShowModal: Dispatch<SetStateAction<boolean>>
}
export const AuthForm = ({ setShowModal }: AuthFormProps) => {
  const { login } = useAuth()
  const signIn = trpc.useMutation(['auth.signin'])
  const loginGoogle = useGoogleLogin({
    onSuccess: (response) => {
      signIn.mutate(
        { token: response.access_token, type: 'GOOGLE' },
        {
          onSuccess: (data) => {
            localStorage.setItem('accessToken', data.data.accessToken)
            login({ ...data.data.user })
            setShowModal(false)
          },
          onError: (error) => console.error(error),
        },
      )
    },
    onError: (error) => console.error(error),
  })

  return (
    <div className="flex flex-col w-full p-6 bg-[#15151b] ">
      <div className="text-xl font-semibold text-center text-white">
        Đăng nhập vào <span className="font-bold ">Ume</span>
      </div>
      <div className="flex flex-col justify-center gap-4 my-4">
        <button onClick={() => loginGoogle()} className="hover:bg-slate-700 bg-[#292734] px-3 py-2 rounded-2xl">
          <div className="flex justify-center flex-1">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.3049 7.3025C15.2864 7.11878 15.2001 6.94856 15.0628 6.82512C14.9255 6.70168 14.747 6.63389 14.5624 6.635H8.8999C8.4874 6.635 8.1499 6.9725 8.1499 7.385V8.6675C8.1499 9.08 8.4874 9.4175 8.8999 9.4175H12.2824C12.1999 10.1075 11.7499 11.15 10.7524 11.8475C10.1149 12.29 9.2674 12.5975 8.1499 12.5975C8.0974 12.5975 8.0524 12.5975 7.9999 12.59C6.0874 12.53 4.4674 11.2475 3.8824 9.485C3.72018 9.00663 3.63659 8.50512 3.6349 8C3.6349 7.4825 3.7249 6.98 3.8749 6.515C3.9199 6.38 3.9724 6.245 4.0324 6.11C4.7224 4.5575 6.2299 3.4625 7.9999 3.41C8.0449 3.4025 8.0974 3.4025 8.1499 3.4025C9.2224 3.4025 10.0249 3.755 10.5874 4.145C10.8799 4.3475 11.2699 4.3025 11.5249 4.055L12.5674 3.035C12.8974 2.7125 12.8674 2.165 12.4924 1.895C11.2999 1.0175 9.8449 0.5 8.1499 0.5C8.0974 0.5 8.0524 0.5 7.9999 0.5075C6.63592 0.531661 5.30459 0.928878 4.15036 1.65606C2.99613 2.38324 2.06306 3.41261 1.4524 4.6325C0.942402 5.6525 0.649902 6.7925 0.649902 8C0.649902 9.2075 0.942402 10.3475 1.4524 11.3675H1.4599C2.06971 12.5865 3.00154 13.6153 4.15439 14.3424C5.30724 15.0696 6.63713 15.4673 7.9999 15.4925C8.0524 15.5 8.0974 15.5 8.1499 15.5C10.1749 15.5 11.8774 14.8325 13.1149 13.685C14.5324 12.3725 15.3499 10.4525 15.3499 8.165C15.3499 7.8425 15.3349 7.565 15.3049 7.3025Z"
                fill="white"
              />
            </svg>
            <span className="ml-3 text-white ">Đăng nhập bằng Google</span>
          </div>
        </button>
      </div>
    </div>
  )
}

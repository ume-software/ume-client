import { signIn } from 'next-auth/react'

enum LoginType {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  TWITCH = 'TWITCH',
}

export const AuthForm = () => {
  // const popupCenter = (url: string, title: string) => {
  //   const dualScreenLeft = window.screenLeft ?? window.screenX
  //   const dualScreenTop = window.screenTop ?? window.screenY

  //   const width = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width

  //   const height = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height

  //   const systemZoom = width / window.screen.availWidth

  //   const left = (width - 500) / 2 / systemZoom + dualScreenLeft
  //   const top = (height - 550) / 2 / systemZoom + dualScreenTop

  //   const newWindow = window.open(
  //     url,
  //     title,
  //     `width=${500 / systemZoom},height=${550 / systemZoom},top=${top},left=${left}`,
  //   )

  //   newWindow?.focus()
  // }

  return (
    <div className="flex flex-col w-full p-6 bg-[#15151b] font-nunito">
      <div className="text-xl font-semibold text-center text-white">
        Đăng nhập vào <span className="font-bold ">Ume</span>
      </div>
      <div className="flex flex-col justify-center gap-4 my-4">
        <button
          // onClick={() => popupCenter('/auth/sign-in-google', 'Sign In Google')}
          onClick={() => signIn('google')}
          className="hover:bg-slate-700 bg-[#292734] px-3 py-2 rounded-2xl"
        >
          <div className="flex justify-center flex-1">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.3049 7.3025C15.2864 7.11878 15.2001 6.94856 15.0628 6.82512C14.9255 6.70168 14.747 6.63389 14.5624 6.635H8.8999C8.4874 6.635 8.1499 6.9725 8.1499 7.385V8.6675C8.1499 9.08 8.4874 9.4175 8.8999 9.4175H12.2824C12.1999 10.1075 11.7499 11.15 10.7524 11.8475C10.1149 12.29 9.2674 12.5975 8.1499 12.5975C8.0974 12.5975 8.0524 12.5975 7.9999 12.59C6.0874 12.53 4.4674 11.2475 3.8824 9.485C3.72018 9.00663 3.63659 8.50512 3.6349 8C3.6349 7.4825 3.7249 6.98 3.8749 6.515C3.9199 6.38 3.9724 6.245 4.0324 6.11C4.7224 4.5575 6.2299 3.4625 7.9999 3.41C8.0449 3.4025 8.0974 3.4025 8.1499 3.4025C9.2224 3.4025 10.0249 3.755 10.5874 4.145C10.8799 4.3475 11.2699 4.3025 11.5249 4.055L12.5674 3.035C12.8974 2.7125 12.8674 2.165 12.4924 1.895C11.2999 1.0175 9.8449 0.5 8.1499 0.5C8.0974 0.5 8.0524 0.5 7.9999 0.5075C6.63592 0.531661 5.30459 0.928878 4.15036 1.65606C2.99613 2.38324 2.06306 3.41261 1.4524 4.6325C0.942402 5.6525 0.649902 6.7925 0.649902 8C0.649902 9.2075 0.942402 10.3475 1.4524 11.3675H1.4599C2.06971 12.5865 3.00154 13.6153 4.15439 14.3424C5.30724 15.0696 6.63713 15.4673 7.9999 15.4925C8.0524 15.5 8.0974 15.5 8.1499 15.5C10.1749 15.5 11.8774 14.8325 13.1149 13.685C14.5324 12.3725 15.3499 10.4525 15.3499 8.165C15.3499 7.8425 15.3349 7.565 15.3049 7.3025Z"
                fill="white"
              />
            </svg>
            <span className="ml-3 text-white font-nunito">Đăng nhập bằng Google</span>
          </div>
        </button>
        <button disabled className="hover:bg-slate-700 bg-[#292734] px-3 py-2 rounded-2xl">
          <div className="flex justify-center flex-1">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.5 11.1425C15.5 13.8725 13.8725 15.5 11.1425 15.5H10.25C9.8375 15.5 9.5 15.1625 9.5 14.75V10.4225C9.5 10.22 9.665 10.0475 9.8675 10.0475L11.1875 10.025C11.2925 10.0175 11.3825 9.9425 11.405 9.8375L11.6675 8.405C11.6726 8.37253 11.6706 8.33934 11.6616 8.30773C11.6527 8.27611 11.6369 8.24681 11.6155 8.22186C11.5942 8.1969 11.5676 8.17689 11.5377 8.16319C11.5079 8.14949 11.4754 8.14243 11.4425 8.1425L9.845 8.165C9.635 8.165 9.47 8 9.4625 7.7975L9.4325 5.96C9.4325 5.84 9.53 5.735 9.6575 5.735L11.4575 5.705C11.585 5.705 11.6825 5.6075 11.6825 5.48L11.6525 3.68C11.6525 3.5525 11.555 3.455 11.4275 3.455L9.4025 3.485C9.1069 3.48949 8.81508 3.55227 8.54379 3.66974C8.27249 3.78721 8.02704 3.95707 7.8215 4.16957C7.61597 4.38207 7.45439 4.63305 7.34602 4.90811C7.23766 5.18317 7.18464 5.47691 7.19 5.7725L7.2275 7.835C7.235 8.045 7.07 8.21 6.86 8.2175L5.96 8.2325C5.8325 8.2325 5.735 8.33 5.735 8.4575L5.7575 9.8825C5.7575 10.01 5.855 10.1075 5.9825 10.1075L6.8825 10.0925C7.0925 10.0925 7.2575 10.2575 7.265 10.46L7.3325 14.735C7.34 15.155 7.0025 15.5 6.5825 15.5H4.8575C2.1275 15.5 0.5 13.8725 0.5 11.135V4.8575C0.5 2.1275 2.1275 0.5 4.8575 0.5H11.1425C13.8725 0.5 15.5 2.1275 15.5 4.8575V11.1425Z"
                fill="white"
              />
            </svg>
            <span className="ml-3 text-white font-nunito">Đăng nhập bằng Facebook</span>
          </div>
        </button>
        <button disabled className="hover:bg-slate-700 bg-[#292734] px-3 py-2 rounded-2xl">
          <div className="flex justify-center flex-1">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.375 0.5H2.78C2.5325 0.5 2.2925 0.6275 2.1575 0.8375L1.0025 2.5625C0.920078 2.68433 0.875702 2.82791 0.875 2.975V12.5C0.875 12.9125 1.2125 13.25 1.625 13.25H3.125C3.5375 13.25 3.875 13.5875 3.875 14V14.75C3.875 15.1625 4.2125 15.5 4.625 15.5H5.72C5.9675 15.5 6.2075 15.3725 6.3425 15.1625L7.4 13.58C7.5425 13.37 7.775 13.2425 8.0225 13.2425H11.06C11.2625 13.2425 11.45 13.16 11.5925 13.025L14.9 9.7175C14.9698 9.64767 15.0251 9.5646 15.0624 9.47317C15.0998 9.38173 15.1185 9.28376 15.1175 9.185V1.25C15.125 0.8375 14.7875 0.5 14.375 0.5ZM7.0925 8.645C7.0925 8.885 6.8975 9.0725 6.665 9.0725H5.81C5.69662 9.0725 5.58788 9.02746 5.50771 8.94729C5.42754 8.86712 5.3825 8.75838 5.3825 8.645V4.3625C5.3825 4.1225 5.5775 3.935 5.81 3.935H6.665C6.905 3.935 7.0925 4.13 7.0925 4.3625V8.645ZM11.375 8.645C11.375 8.885 11.18 9.0725 10.9475 9.0725H10.0925C10.0364 9.0725 9.98077 9.06144 9.9289 9.03996C9.87704 9.01847 9.82991 8.98699 9.79021 8.94729C9.75051 8.90759 9.71903 8.86046 9.69754 8.8086C9.67606 8.75673 9.665 8.70114 9.665 8.645V4.3625C9.665 4.1225 9.86 3.935 10.0925 3.935H10.9475C11.1875 3.935 11.375 4.13 11.375 4.3625V8.645Z"
                fill="white"
              />
            </svg>
            <span className="ml-3 text-white font-nunito">Đăng nhập bằng Twitch</span>
          </div>
        </button>
      </div>
    </div>
  )
}

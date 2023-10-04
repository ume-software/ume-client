import { CheckSmall, CloseSmall } from '@icon-park/react'

import { useState } from 'react'

import { Switch } from 'antd'

import AddSkillForm from './add-skill-form'

const BecomeProvider = () => {
  const [checked, setChecked] = useState<boolean>(false)

  return (
    <>
      <div className="w-full px-10">
        <p className="text-4xl font-bold">Trở thành nhà cung cấp</p>

        <div className="w-[80%] mt-10 px-5 space-y-10">
          <div className="flex items-center justify-between gap-5 py-10 border-b border-white border-opacity-30">
            <div className="flex flex-col gap-2">
              <p className="text-lg">Trở thành nhà cung cấp dịch vụ của chúng tôi</p>
              <span className="w-4/5 text-sm opacity-50">
                Trở thành nhà cung cấp để có thể mang lại nhiều lợi ích cho bạn như là kiếm tiền, gia tăng độ nổi
                tiếng,...
              </span>
            </div>
            <Switch
              className="bg-red-600"
              checkedChildren={<CheckSmall theme="outline" size="23" fill="#fff" strokeLinejoin="bevel" />}
              unCheckedChildren={<CloseSmall theme="outline" size="23" fill="#fff" strokeLinejoin="bevel" />}
              defaultChecked={false}
              onChange={() => {
                setChecked(!checked)
              }}
            />
          </div>
          <div>{checked && <AddSkillForm />}</div>
        </div>
      </div>
    </>
  )
}
export default BecomeProvider

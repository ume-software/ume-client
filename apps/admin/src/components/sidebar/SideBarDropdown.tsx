import { Down, Up } from '@icon-park/react'
import { getItem } from '~/hooks/localHooks'

import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { SidebarNavigation } from './SidebarNavigation'

const SideBarDropdown = () => {
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState<any>([])
  const [selectNavigation, setSelectNavigation] = useState<any>()
  const adminInfo = getItem('user')

  function toggleItem(key) {
    setExpandedItems((prevExpanded) =>
      prevExpanded.includes(key) ? prevExpanded.filter((item) => item !== key) : [...prevExpanded, key],
    )
  }
  useEffect(() => {
    setSelectNavigation(router.pathname?.replace(/^\//, ''))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSelectNavigation(key) {
    setSelectNavigation(key)
  }

  return (
    <div className="h-full overflow-auto pb-28 side-bar">
      {SidebarNavigation.map((item) => (
        <div key={item.key} className="pl-5 mb-5">
          <span className="text-lg font-bold text-white">{item.label}</span>
          {item.children &&
            item.children.map((subItem) => (
              <div key={subItem.key} className="cursor-pointer ">
                {subItem.children ? (
                  <div key={subItem.key}>
                    <div
                      onClick={() => toggleItem(subItem.key)}
                      className="ml-3 my-2 px-4 mr-4 py-2 w-[17rem] rounded-xl text-white flex justify-between"
                    >
                      <div className="flex">
                        {subItem.icon} <div className="ml-2 text-sm font-bold">{subItem.label}</div>
                      </div>
                      <div className="h-fit w-fit">
                        {expandedItems.includes(subItem.key) ? (
                          <Up theme="outline" size="20" fill="#fff" />
                        ) : (
                          <Down theme="outline" size="20" fill="#fff" />
                        )}
                      </div>
                    </div>
                    {subItem.children &&
                      expandedItems.includes(subItem.key) &&
                      subItem.children.map((subItem2) => {
                        return (
                          <div key={subItem2.key} className="my-2 ml-12 mr-4">
                            <Link
                              href={subItem2?.path!}
                              onClick={() => {
                                handleSelectNavigation(subItem2.key)
                              }}
                              className={`px-4 py-2 rounded-xl text-white flex ${
                                selectNavigation === subItem2.key ? 'bg-[#7463f0]' : ''
                              }`}
                            >
                              {subItem2.icon} <div className="ml-2 text-sm font-bold">{subItem2.label}</div>
                            </Link>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <>
                    {subItem.key == 'admin-account-manager' &&
                    adminInfo?.adminRoles?.some((item) => item.roleType !== 'SUPER_ADMIN') ? (
                      <></>
                    ) : (
                      <Link
                        href={subItem?.path!}
                        className={`ml-3 my-2 px-4 mr-4 py-2 w-[16rem] rounded-xl text-white flex justify-between items-center ${
                          selectNavigation === subItem.key ? 'bg-[#7463f0]' : ''
                        }`}
                        key={subItem.key}
                        onClick={() => {
                          handleSelectNavigation(subItem.key)
                        }}
                      >
                        <div className="flex">
                          {subItem.icon} <div className="ml-2 text-sm font-bold">{subItem.label}</div>
                        </div>
                      </Link>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}

export default SideBarDropdown

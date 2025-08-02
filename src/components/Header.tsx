'use client'

import React from 'react'
import Image from 'next/image'
import { useLayoutContext } from '@/context/LayoutContext'

type HeaderProp = {
  title: string
}

const Header = ({ title }: HeaderProp) => {

    const { toggleMenu, setToggleMenu } = useLayoutContext();

  return (
    <header className="sticky top-0 flex items-center justify-between px-10 py-5 bg-white shadow-md">
        <Image
          src="/menu-out.svg"
          width={40}
          height={40}
          alt="Hope Bridge Logo"
          className="absolute left-[-10px] top-6 cursor-pointer lg:hidden"
          onClick={() => setToggleMenu(toggleMenu === 'show-menu' ? '' : 'show-menu')}
        />

        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-wrap">{title}</h1>
          <p className="text-[#64748b] text-sm">Welcome back, John Doe</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-full bg-(image:--avatar-gradient) text-white">JD</div>

          <div>
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-[#64748b] text-sm">Administrator</p>
          </div>

          <button className="notification-btn">
            <span>🔔</span>
            <span className="notification-badge">3</span>
          </button>
        </div>
      </header>
  )
}

export default Header
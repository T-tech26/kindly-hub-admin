'use client'

import { SideMenu } from '@/constants'
import { useLayoutContext } from '@/context/LayoutContext'
import { logOut } from '@/lib/actions'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const SideNav = () => {

  const router = useRouter();
  const pathName = usePathname();
  const { toggleMenu, setToggleMenu } = useLayoutContext();


  const handleLogOut = async () => {
    const data = await logOut();

    if(data === 'success') router.push('/login');

    if(data === 'error') toast.error('An error occured while logging you out');
  }


  return (
    <section className={`sidebar ${toggleMenu}`}>
        <div className="sidebar-header">
            <Link href='/'>
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={180}
                    height={90}
                    className=''
                />
            </Link>
        </div>
        
        <div className='flex-1'>
          {SideMenu.map((item, index) => {
            
            const isActive = pathName === item.path || pathName.startsWith(`${item.path}/`);

            return (
              <div
                key={index}
                className={`side-links text-(--sidebar-text-color) ${isActive ? 'border-l-4 border-l-(--sidebar-active-border) bg-white/10 text-white' : ''}`}
              >
                <Link
                  href={item.path}
                  className='hidden lg:block'
                >
                  {item.icon} {item.title}
                </Link>

                <Link
                  href={item.path}
                  className='lg:hidden'
                  onClick={() => setToggleMenu(toggleMenu === 'hide-menu' ? '' : 'hide-menu')}
                >
                  {item.icon} {item.title}
                </Link>
              </div>
            )}
          )}
        </div>

        <button
          className='logout-btn'
          onClick={() => handleLogOut()}
        >
          Logout
          <Image
            src="/logout.svg"
            alt="Logout Icon"
            width={20}
            height={20}
          />
        </button>
    </section>
  )
}

export default SideNav
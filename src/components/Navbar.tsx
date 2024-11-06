import { imageConfig } from '@/constant/imageConfig'
import { RootState } from '@/store/redux.types'
import { useStateSelector } from '@/store/root.reducer'
import Image from 'next/image'
import React from 'react'
import Typography from './Typography'
import { Avatar, AvatarImage } from './ui/avatar'

const Navbar = () => {
  const user = useStateSelector((state: RootState) => state.user.user)

  return (
    <div className='flex items-center justify-between border-b-2 px-10 py-3'>
      <div className='flex items-center gap-x-6'>
        <Image
          src={imageConfig.LOGO}
          alt='logo'
          height={50}
          width={50}
        />
        <Typography
          weight='semibold'
          className='text-3xl tracking-wide'
        >
          Email AI
        </Typography>
      </div>
      <div className='flex items-center gap-x-4'>
        <Typography
          size='lg'
          weight='semibold'
        >
          {user?.full_name}
        </Typography>
        <Avatar>
          {user?.avatar_url ? (
            <AvatarImage src={user.avatar_url} />
          ) : (
            <div className='flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#FFB457] to-[#FF705B] text-black/80'>
              <Typography
                size='lg'
                weight='semibold'
              >
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : ''}
              </Typography>
            </div>
          )}
        </Avatar>
      </div>
    </div>
  )
}

export default Navbar

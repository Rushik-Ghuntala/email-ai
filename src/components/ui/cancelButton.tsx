import React from 'react'
import { Button, ButtonProps } from '@nextui-org/react'
import { Loader2 } from 'lucide-react'
import Typography from '../Typography'

type CustomButtonProps = ButtonProps & {
  iconSrc?: string
  iconAlt?: string
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
}

const CancelButton: React.FC<CustomButtonProps> = ({
  iconSrc,
  iconAlt = 'icon',
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  children,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={disabled || isLoading}
      className={`flex w-full items-center rounded-full px-8 py-6 transition-opacity duration-300 ${disabled || isLoading ? 'cursor-not-allowed opacity-50' : ''} bg-gradient-to-r from-white to-gray-50 ring-2 ring-[#1A73E8]`}
    >
      {isLoading ? (
        <span className='flex items-center'>
          <Loader2 className='h-5 w-5 animate-spin text-black' />{' '}
        </span>
      ) : (
        <>
          {iconSrc && iconPosition === 'left' && (
            <span className='mr-2 flex items-center'>
              <img
                src={iconSrc}
                alt={iconAlt}
                className='h-5 w-5'
              />
            </span>
          )}
          <Typography
            size='lg'
            weight='semibold'
            color='text-black'
          >
            {children}
          </Typography>

          {iconSrc && iconPosition === 'right' && (
            <span className='ml-2 flex items-center'>
              <img
                src={iconSrc}
                alt={iconAlt}
                className='h-5 w-5'
              />
            </span>
          )}
        </>
      )}
    </Button>
  )
}

export default CancelButton

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

const CustomButton: React.FC<CustomButtonProps> = ({
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
      className={`flex items-center rounded-full px-8 py-6 transition-opacity duration-300 ${disabled || isLoading ? 'cursor-not-allowed opacity-50' : ''} bg-gradient-to-r from-[#1A73E8] to-[#81C8FF]`}
    >
      {isLoading ? (
        <span className='flex items-center'>
          <Loader2 className='h-5 w-5 animate-spin text-white' />{' '}
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
            color='text-white'
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

export default CustomButton

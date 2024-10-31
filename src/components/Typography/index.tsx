import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface FontStyle {
  weight: string
  size: string
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  size?: '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'
  weight?:
    | 'black'
    | 'extrabold'
    | 'bold'
    | 'semibold'
    | 'medium'
    | 'normal'
    | 'thin'
  color?: string
  className?: string
  children: ReactNode
  onClick?: () => void
}

const Typography = ({
  size = 'md',
  weight = 'normal',
  color = 'text-black',
  className,
  children,
  onClick,
  ...props
}: Props) => {
  // Font size mapping based on the image
  const sizeMapping: Record<string, string> = {
    '2xl': 'text-2xl', // Font size: 28px
    xl: 'text-xl', // Font size: 24px
    lg: 'text-lg', // Font size: 20px
    md: 'text-base', // Font size: 16px
    sm: 'text-sm', // Font size: 14px
    xs: 'text-xs', // Font size: 12px
  }

  // Font weight mapping
  const weightMapping: Record<string, string> = {
    black: 'font-black', // 900
    extrabold: 'font-extrabold', // 800
    bold: 'font-bold', // 700
    semibold: 'font-semibold', // 600
    medium: 'font-medium', // 500
    normal: 'font-normal', // 400
    thin: 'font-thin', // 100
  }

  return (
    <div
      className={cn(sizeMapping[size], weightMapping[weight], color, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Typography

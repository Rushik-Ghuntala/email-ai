'use client'
import { extendVariants, Textarea } from '@nextui-org/react'

export const TextArea = extendVariants(Textarea, {
  variants: {
    variant: {
      primaryBordered: {
        inputWrapper: [
          'rounded-[12px] shadow-md px-4 py-3 transition-all duration-300 ',
          'border border-[#1A73E8] bg-gradient-to-r from-white to-gray-50',
          'hover:border-[#1A73E8] hover:shadow-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-white',
          'focus:border-2 focus:border-[#1A73E8] focus-visible:outline-none',
        ],
        innerWrapper: ['gap-2'],
        label:
          'my-0 text-sm font-medium text-gray-600 transition-colors duration-200',
      },
    },
  },
  defaultVariants: {
    variant: 'primaryBordered',
    size: 'sm',
    textSize: 'basefont',
    labelPlacement: 'outside',
  },
})

'use client'
import { extendVariants, Input } from '@nextui-org/react'

export const InputField = extendVariants(Input, {
  variants: {
    variant: {
      primaryBordered: {
        inputWrapper: [
          'rounded-[12px] shadow-md px-4 py-3 transition-all duration-300',
          'ring-1 ring-[#1A73E8] bg-gradient-to-r from-white to-gray-50',
          'hover:ring-[#1A73E8] hover:shadow-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-white',
          'focus:ring-2 focus:ring-[#1A73E8] focus-visible:outline-none',
        ],
        innerWrapper: ['gap-2'],
        label:
          'my-0 text-sm font-medium text-gray-600 transition-colors duration-200',
      },
    },
  },
  defaultVariants: {
    variant: 'primaryBordered',
    size: 'md',
    textSize: 'basefont',
    labelPlacement: 'outside',
  },
})

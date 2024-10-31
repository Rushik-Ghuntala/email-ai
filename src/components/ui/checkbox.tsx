import { Checkbox } from '@nextui-org/react'
import React from 'react'
import Typography from '../Typography'

interface CheckboxProps {
  text: string
  isSelected: boolean
  onSelect: (value: string) => void
  onCheck?: (isChecked: boolean) => void
}

export const CustomCheckbox: React.FC<CheckboxProps> = ({
  text,
  isSelected,
  onSelect,
  onCheck,
}) => {
  const handleCheckboxChange = () => {
    onSelect(text)
    if (onCheck) {
      onCheck(!isSelected)
    }
  }

  return (
    <div className='flex items-center gap-4'>
      <Checkbox
        isSelected={isSelected}
        size='md'
        radius='sm'
        className={`flex items-center gap-2 text-[20px]`}
        onChange={handleCheckboxChange}
        color='primary'
        // variant="flat"
      >
        <Typography
          size='sm'
          color='primary'
        >
          {text}
        </Typography>
      </Checkbox>
    </div>
  )
}

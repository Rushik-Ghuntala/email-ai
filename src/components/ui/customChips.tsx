import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useFormikContext } from 'formik'
import Typography from '../Typography'

type CustomChipsProps = {
  id: string
  data: string[]
  label?: string
  description?: string
  onSelect: (name: string, item: string) => void
  onSelect2?: (step: number, name: string, item: string) => void
  name: string
  selected?: string[]
  isInvalid?: boolean
  currentStep?: number
  setedStep?: number
}

export const CustomChips = ({
  id,
  data,
  label,
  description,
  onSelect,
  onSelect2,
  name,
  selected = [],
  currentStep,
  setedStep,
}: CustomChipsProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(selected)

  const { touched, errors } = useFormikContext()

  const handleItemClick = (item: string) => {
    const isSelected = selectedItems.includes(item)
    const newSelectedItems = isSelected
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item]

    setSelectedItems(newSelectedItems)
    onSelect(name, item)
    if (onSelect2) {
      onSelect2(setedStep ?? 0, name, item)
    }
  }

  useEffect(() => {
    if (currentStep && setedStep && currentStep <= setedStep) {
      setSelectedItems([])
    }
  }, [currentStep])

  return (
    <div className={'flex flex-col gap-4'}>
      <div>
        <Typography
          size={'md'}
          weight={'medium'}
          className={'text-start !text-[1rem] md:text-start md:!text-[1.2rem]'}
        >
          {label}
        </Typography>
        {description && (
          <Typography
            size={'xs'}
            className={
              'pt-2 text-start !text-[0.75rem] md:text-start md:!text-[0.9rem]'
            }
          >
            {description}
          </Typography>
        )}
      </div>
      <div
        className={'flex h-auto flex-wrap gap-4 md:justify-start md:text-start'}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className={clsx(
              'cursor-pointer rounded-full border px-6 py-2 transition-colors duration-300',
              selectedItems.includes(item)
                ? 'bg-gradient-to-r from-[#1A73E8] to-[#6BB7F6] text-white'
                : 'border-transparent bg-gradient-to-r from-[#FFFFFF] to-[#F1F5F9] ring-1 ring-[#1A73E8] hover:bg-gradient-to-r hover:from-[#F1F5F9] hover:to-[#FFFFFF] hover:ring-2' // Gradient for unselected
            )}
            onClick={() => handleItemClick(item)}
          >
            <Typography
              className={clsx(
                selectedItems.includes(item)
                  ? 'text-white'
                  : 'text-text-secondary'
              )}
              size={'sm'}
            >
              {item}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  )
}

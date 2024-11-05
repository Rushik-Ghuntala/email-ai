'use client'

import React, { useState, useEffect, useRef } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill/dist/quill.snow.css'
import { Loader2 } from 'lucide-react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import Typography from '@/components/Typography'

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
  toolbarId: string
  isSubmitted: boolean
}

const CustomToolbar: React.FC<{ toolbarId: string }> = ({ toolbarId }) => {
  const isSubject = toolbarId === 'toolbar-subject'

  return (
    <div>
      {/* <div className='extra-work ql-toolbar ql-snow flex items-center space-x-1 px-4 py-2'> */}
      {/* <select className='ql-font focus:outline-none'>
        <option value='sans-serif'>Sans Serif</option>
        <option value='serif'>Serif</option>
        <option value='monospace'>Monospace</option>
      </select>

      <div className='mx-2 h-5 border-l border-gray-300' />

      <select className='ql-size focus:outline-none'>
        <option value='normal'>Normal</option>
        <option value='small'>Small</option>
        <option value='large'>Large</option>
        <option value='huge'>Huge</option>
      </select>

      <div className='mx-2 h-5 border-l border-gray-300' /> */}

      {/* <button className='ql-bold focus:outline-none' />
      <button className='ql-italic focus:outline-none' />
      <button className='ql-underline focus:outline-none' /> */}

      {!isSubject && (
        <>
          {/* <button className='ql-strike focus:outline-none' /> */}

          {/* <div className='mx-2 h-5 border-l border-gray-300' /> */}

          {/* <select className='ql-color focus:outline-none'></select> */}
          {/* <div className='mx-2 h-5 border-l border-gray-300' />

          <button
            className='ql-align'
            value=''
            title='Align Left'
          />
          <button
            className='ql-align'
            value='center'
            title='Align Center'
          />
          <button
            className='ql-align'
            value='right'
            title='Align Right'
          />

          <div className='mx-2 h-5 border-l border-gray-300' />

          <button
            className='ql-list focus:outline-none'
            value='ordered'
          />
          <button
            className='ql-list focus:outline-none'
            value='bullet'
          /> */}

          {/* <div className='mx-2 h-5 border-l border-gray-300' /> */}

          {/* <button className='ql-link focus:outline-none' />
          <button className='ql-image focus:outline-none' /> */}
        </>
      )}
    </div>
  )
}

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const getRandomInt = (max: number) => Math.floor(Math.random() * max)

interface HyperTextProps {
  text: string
  duration?: number
  framerProps?: Variants
  className?: string
  animateOnLoad?: boolean
}

const HyperText: React.FC<HyperTextProps> = ({
  text,
  duration = 800,
  framerProps = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 3 },
  },
  className,
  animateOnLoad = true,
}) => {
  const [displayText, setDisplayText] = useState(text.split(''))
  const [trigger, setTrigger] = useState(false)
  const interations = React.useRef(0)
  const isFirstRender = React.useRef(true)

  const triggerAnimation = () => {
    interations.current = 0
    setTrigger(true)
  }

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (!animateOnLoad && isFirstRender.current) {
          clearInterval(interval)
          isFirstRender.current = false
          return
        }
        if (interations.current < text.length) {
          setDisplayText((t) =>
            t.map((l, i) =>
              l === ' '
                ? l
                : i <= interations.current
                  ? text[i]
                  : alphabets[getRandomInt(26)]
            )
          )
          interations.current = interations.current + 0.1
        } else {
          setTrigger(false)
          clearInterval(interval)
        }
      },
      duration / (text.length * 10)
    )
    return () => clearInterval(interval)
  }, [text, duration, trigger, animateOnLoad])

  return (
    <div
      className='flex scale-100 cursor-default overflow-hidden py-2'
      onMouseEnter={triggerAnimation}
    >
      <AnimatePresence mode='wait'>
        {displayText.map((letter, i) => (
          <motion.span
            key={i}
            className={`font-mono ${letter === ' ' ? 'w-3' : ''} ${className}`}
            {...framerProps}
          >
            {letter.toUpperCase()}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  toolbarId,
  isSubmitted,
}) => {
  const [displayValue, setDisplayValue] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const prevValueRef = useRef('')
  const prevSubmittedRef = useRef(false)

  useEffect(() => {
    if (
      isSubmitted &&
      !prevSubmittedRef.current &&
      value !== prevValueRef.current
    ) {
      setIsAnimating(true)
      setDisplayValue('')
      prevValueRef.current = value
    }
    prevSubmittedRef.current = isSubmitted
  }, [isSubmitted, value])

  useEffect(() => {
    if (isAnimating) {
      let currentIndex = 0
      const animateText = () => {
        if (currentIndex <= value.length) {
          setDisplayValue(value.slice(0, currentIndex))
          currentIndex++
          setTimeout(animateText, 30)
        } else {
          setIsAnimating(false)
        }
      }
      animateText()
    }
  }, [value, isAnimating])

  const modules = {
    toolbar: {
      container: `#${toolbarId}`,
      handlers: {
        image: toolbarId === 'toolbar-subject' ? false : undefined,
        link: toolbarId === 'toolbar-subject' ? false : undefined,
      },
    },
  }

  const customStyles = `
    .ql-toolbar.ql-snow {
      font-family: inherit;
    }
    .ql-toolbar.ql-snow .ql-picker {
      height: 24px;
    }
    .ql-toolbar.ql-snow .ql-picker-label {
      border: none;
      padding: 0 4px;
    }
    .ql-toolbar.ql-snow button {
      height: 24px;
      width: 24px;
      padding: 2px;
    }
    .ql-toolbar.ql-snow button:hover {
      color: #000;
    }
    .ql-toolbar.ql-snow .ql-picker-label:hover {
      color: #000;
    }
    .ql-container.ql-snow {
      border: none;
      font-family: inherit;
    }
  `

  return (
    <div className='text-editor rounded-xl bg-gradient-to-r from-white to-gray-50 shadow-md ring-2 ring-[#1A73E8] transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white hover:shadow-lg hover:ring-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8] focus-visible:outline-none'>
      {/* <style>{customStyles}</style> */}
      <div
        id={toolbarId}
        className='!border-none'
      >
        <CustomToolbar toolbarId={toolbarId} />
      </div>
      {isSubmitted ? (
        <div className='flex items-center justify-center p-4'>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          <HyperText
            text={'Generating Content...'}
            duration={1500}
            className='text-lg font-semibold text-gray-700'
            animateOnLoad={true}
          />
        </div>
      ) : value ? (
        <ReactQuill
          theme='snow'
          value={value}
          onChange={onChange}
          modules={modules}
          className='editor !border-0 px-2 pb-4'
        />
      ) : (
        <Typography
          color='text-gray-500'
          className='cursor-not-allowed p-4'
        >
          {toolbarId === 'toolbar-subject'
            ? 'Generated Subject will appear here...'
            : 'Generated Email Content will appear here...'}
        </Typography>
      )}
    </div>
  )
}

export default TextEditor

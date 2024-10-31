import EmailGeneratePage from '@/section/EmailGenerator/EmailGeneratorPage'
import React from 'react'

const Home = () => {
  return (
    <div className='flex items-start'>
      <div className='h-screen w-1/2'>
        <EmailGeneratePage />
      </div>
      <div className='h-screen w-1/2'>Hello</div>
    </div>
  )
}

export default Home

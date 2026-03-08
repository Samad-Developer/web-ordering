import React from 'react'
import { Spinner } from '@/components/ui/spinner'

const loading = () => {
  return (
    <div className='h-lvh flex items-center justify-center'>
      <Spinner />
    </div>
  )
}

export default loading
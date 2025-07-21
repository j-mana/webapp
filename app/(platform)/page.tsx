'use client'

import { useState } from 'react'
import ChatIcon from "@/icons/ChatIcon"
import TabGroup from "@/components/TabGroup"
import StyleIcon from "@/icons/StyleIcon"
import SelectionIcon from '@/icons/SelectionIcon'
import GridIcon from '@/icons/GridIcon'
import Header from '@/components/Header'
import Canvas from '@/components/Canvas'
import ChatInput from '@/components/ChatInput'

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState('chat')
  const [activeSecondaryTab, setActiveSecondaryTab] = useState('edit')

  const mainTabs = [
    { id: 'chat', label: 'Chat', icon: <ChatIcon size={14}/> },
    { id: 'style', label: 'Style', icon: <StyleIcon size={14}/> }
  ]

  const secondaryTabs = [
    { id: 'edit', label: 'Edit', icon: <SelectionIcon size={14}/> },
    { id: 'analyze', label: 'Analyze', icon: <GridIcon size={14}/> }
  ]

  return (
    <div className='h-dvh w-full flex flex-col'>
      <Header />
      
      Homepage
    </div>
  )
}

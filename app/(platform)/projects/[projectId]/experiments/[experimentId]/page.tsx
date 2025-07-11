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
      <div className='flex flex-1 overflow-hidden'>
        <div className='flex flex-row h-full w-full'>
          <div className='p-4 flex flex-col w-96 min-w-96'>
            <TabGroup 
              tabs={mainTabs}
              defaultTab="chat"
              onTabChange={setActiveMainTab}
            />
            <ChatInput />
          </div>
          <div className='overflow-auto h-full w-full border border-border-light rounded-tl-xl divide-y divide-border-light'>
            <div className='flex flex-row gap-2 items-center w-full bg-canvas px-4 py-2 sticky top-0 z-10'>
              <TabGroup 
                tabs={secondaryTabs}
                defaultTab="edit"
                onTabChange={setActiveSecondaryTab}
              />
            </div>
            <div className='h-full w-full bg-gray-50'>
              <Canvas />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

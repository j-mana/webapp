'use client'

import { useState } from 'react'
import ChatIcon from "@/icons/ChatIcon"
import TabGroup from "@/components/TabGroup"
import StyleIcon from "@/icons/StyleIcon"
import SendIcon from '@/icons/SendIcon'
import SelectionIcon from '@/icons/SelectionIcon'
import GridIcon from '@/icons/GridIcon'
import Header from '@/components/Header'
import Canvas from '@/components/Canvas'

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
        <div className='grid grid-cols-4 h-full w-full'>
          <div className='col-span-1 p-4 flex flex-col'>
            <TabGroup 
              tabs={mainTabs}
              defaultTab="chat"
              onTabChange={setActiveMainTab}
            />
            <div className='flex flex-col gap-2 bg-white rounded-2xl border border-border-light mt-auto strong-shadow'>
              <textarea className='w-full h-full p-4 resize-none outline-none text-sm' placeholder='Create or edit...'></textarea>

              <div className='flex flex-row p-2'>
                <div className='px-3 py-1.5 bg-black text-white flex flex-row gap-1 items-center rounded-xl w-max ml-auto'>
                  <p className='text-base text-white font-medium'>Send</p>
                  <SendIcon size={14}/>
                </div>
              </div>
            </div>
          </div>
          <div className='col-span-3 overflow-auto h-full w-full border border-border-light rounded-xl divide-y divide-border-light'>
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

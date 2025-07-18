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
import { addChatMessage } from '@/lib/db-mutations'
import { useParams } from 'next/navigation'
import { useData } from '@/components/DataProvider'
import ChatMessage from '@/components/ChatMessage'
import { useChat } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import CursorBoxIcon from '@/icons/CursorBoxIcon'


export default function App() {
  const params = useParams()
  const experimentId = params.experimentId as string
  const [activeMainTab, setActiveMainTab] = useState('chat')
  const [activeSecondaryTab, setActiveSecondaryTab] = useState('edit')
  const [chatInput, setChatInput] = useState('')
  

  const { experiments } = useData()
  const experiment = experiments.find((experiment) => experiment.id === experimentId)
  const chatMessages = experiment?.chatMessages || []

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/agent',
    body: {
      messages: chatMessages,
    },
  });

  const handleSend = async () => {
    await addChatMessage(experimentId, chatInput, 'user')
    setChatInput('')
  }

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

            {activeMainTab === 'chat' && (
              <>
              <div className='flex flex-col gap-2'>
                {chatMessages.map((message) => (
                  <ChatMessage key={message.id} message={message.message} role={message.role as 'user' | 'assistant'} />
                ))}
              </div>


              <ChatInput recommendationsLocation="top" input={chatInput} setInput={setChatInput} onSend={handleSend} />
              </>
            )}


            {activeMainTab === 'style' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='flex flex-col items-center justify-center overflow-hidden relative h-full mt-2 border border-border-light rounded-xl subtle-shadow'>
              
                <div className='flex flex-col items-center justify-center gap-4'>
                  <CursorBoxIcon size={24} className='text-brand-500' />
                  <h3 className='text-lg font-semibold'>Select an element to style</h3>
                  <p className='text-xs text-text-secondary max-w-[155px] text-center'>Edit your copy, layouts, colors, and other variables</p>
                </div>

                <div className='absolute bottom-0'>
                  <Image src="/grid.png" alt="Style Guide" width={1000} height={1000} />
                </div>
              </motion.div>
            )}

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

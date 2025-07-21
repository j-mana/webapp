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
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import CursorBoxIcon from '@/icons/CursorBoxIcon'
import Analytics from '@/components/Analytics'
import SidebarIcon from '@/icons/SidebarIcon'


export default function App() {
  const params = useParams()
  const experimentId = params.experimentId as string
  const [activeMainTab, setActiveMainTab] = useState('chat')
  const [activeSecondaryTab, setActiveSecondaryTab] = useState('edit')
  const [chatInput, setChatInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  
  const { experiments, refreshData } = useData()
  const experiment = experiments.find((experiment) => experiment.id === experimentId)
  const chatMessages = experiment?.chat_messages || []

  // Debug logging
  console.log('🔍 Current experiment:', experiment?.name)
  console.log('🔍 Chat messages count:', chatMessages.length)
  console.log('🔍 Latest messages:', chatMessages.slice(-2))

  const handleSend = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setIsLoading(true);
    
    try {
      // Add user message to database
      await addChatMessage(experimentId, userMessage, 'user');
      
      // Send to API (which will create the assistant message in the database)
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...chatMessages, { role: 'user', content: userMessage }].map(msg => ({
            role: msg.role,
            content: 'message' in msg ? msg.message : msg.content
          })),
          experimentId: experimentId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className={`p-4 h-full flex flex-col transition-all duration-300 ease-in-out ${isSidebarVisible ? 'w-96 min-w-96' : 'flex-1 justify-center items-center'}`}>
            <div className={`${isSidebarVisible ? 'w-full' : 'w-full max-w-2xl'} flex flex-col h-full`}>
            <TabGroup 
              tabs={mainTabs}
              defaultTab="chat"
              onTabChange={setActiveMainTab}
            />

            {activeMainTab === 'chat' && (
              <>
              <div className='flex flex-col gap-4 shrink-0 h-full flex-1 overflow-y-auto'>
                {chatMessages.map((message) => (
                  <ChatMessage key={message.id} message={message.message} role={message.role as 'user' | 'assistant'} />
                ))}
                {isLoading && (
                  <div className='flex items-center gap-2 p-2'>
                    <div className='w-1 h-1 bg-gray-400 rounded-full animate-pulse'></div>
                    <div className='w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-75'></div>
                    <div className='w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-150'></div>
                  </div>
                )}
              </div>

              <ChatInput 
                recommendationsLocation="top" 
                input={chatInput} 
                setInput={setChatInput} 
                onSend={handleSend} 
              />
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
          </div>
          <AnimatePresence>
            {isSidebarVisible && (
            <motion.div 
              layout
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className='overflow-auto h-full w-full border border-border-light rounded-tl-xl divide-y divide-border-light'
            >
              <div className='flex flex-row gap-2 items-center w-full bg-canvas px-4 py-2 sticky top-0 z-10'>
                <TabGroup 
                  tabs={secondaryTabs}
                  defaultTab="edit"
                  onTabChange={setActiveSecondaryTab}
                />
              </div>
              <div className={`h-full w-full ${activeSecondaryTab === 'edit' ? 'bg-gray-50' : 'bg-white'}`}>
                {activeSecondaryTab === 'edit' ? (
                  <Canvas />
                ) : (
                  <Analytics />
                )}
              </div>
            </motion.div>
          )}
          </AnimatePresence>
          <div 
            className="absolute bottom-4 right-4 h-8 w-8 bg-white rounded-md border border-border-light strong-shadow z-50 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          >
            <SidebarIcon size={16} className={`text-gray-400 transition-transform duration-200 ${isSidebarVisible ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>
    </div>
  )
}

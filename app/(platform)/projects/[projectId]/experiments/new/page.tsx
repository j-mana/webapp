"use client"

import ChatInput from "@/components/ChatInput"
import ChevronRightIcon from "@/icons/ChevronRightIcon"
import SidebarIcon from "@/icons/SidebarIcon"
import { addChatMessage, createExperiment } from "@/lib/db-mutations"
import { useUIStore } from "@/store/useUIStore"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewExperimentPage() {
  const { projectId } = useParams()
  const { toggleSidebar, sidebarOpen } = useUIStore((state) => state)
  const router = useRouter()

  const [url, setUrl] = useState('')
  const [goal, setGoal] = useState('')

  const handleNewExperiment = async () => {
    const experimentId = await createExperiment(projectId as string, 'New Experiment', url)
    await addChatMessage(experimentId, goal, 'user')

    router.push(`/projects/${projectId}/experiments/${experimentId}`)
  }
  
  return <div className="flex flex-col gap-4 h-dvh">
    <div className="flex flex-col p-4">
        <div className="flex flex-row gap-2 items-start">
          <AnimatePresence mode="popLayout">
            {!sidebarOpen && (
              <motion.div
                className="flex flex-row gap-2 items-center mt-px"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                layout
              >
                <div onClick={toggleSidebar} className="cursor-pointer hover:text-gray-600 text-gray-400 transition-colors duration-200">
                  <SidebarIcon size={14}/>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-row gap-1 items-center">
            <Link href={`/projects/${projectId}`} className="font-medium text-xs text-text-secondary">Project</Link>
            <ChevronRightIcon size={14} className="text-text-secondary"/>
            <Link href={`/projects/${projectId}/experiments/new`} className="font-medium text-xs text-text-secondary">New</Link>
          </div>
        </div>
      </div>
    <div className="flex flex-col gap-8 items-center justify-center h-full">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold">Create a new experiment</h1>
        <p className="text-sm text-text-secondary max-w-sm"> You can select any page from your website that you’d like to
        improve and we’ll generate variants to test</p>
      </div>

      <div className="flex flex-col gap-4 text-center w-full max-w-lg">
        <div className="flex flex-row max-w-[288px] w-full mx-auto bg-canvas rounded-2xl border border-border-light strong-shadow overflow-hidden">
          <div className="px-3 py-2 text-xs text-text-secondary border-r border-border-light">
            https://
          </div>
          <input type="text" className="w-full outline-none text-xs bg-white px-2" placeholder="Enter a page" />
        </div>
        <ChatInput recommendationsLocation="bottom" input={goal} setInput={setGoal} onSend={handleNewExperiment} />
      </div>
    </div>
  </div>
}
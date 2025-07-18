"use client"

import ChatIcon from "@/icons/ChatIcon"
import ChevronRightIcon from "@/icons/ChevronRightIcon"
import EditIcon from "@/icons/EditIcon"
import SidebarIcon from "@/icons/SidebarIcon"
import { useUIStore } from "@/store/useUIStore"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useData } from "@/components/DataProvider"

export default function ProjectPage() {
  const { toggleSidebar, sidebarOpen } = useUIStore((state) => state)
  const params = useParams()
  const projectId = params.projectId as string
  const { projects } = useData()
  
  // Add client-side check
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const project = projects.find((project) => project.id === projectId)
  const experiments = project?.experiments || []
  


  const quickActions = [
    {
      icon: <EditIcon />,
      id: "create-experiment",
      title: "Create an experiment",
      description: "Select the target, describe your goal, edit variants, then publish ",
      featured: true,
    },
    {
      icon: <EditIcon />,
      id: "create-experiment-1",
      title: "Create an experiment",
      description: "Select the target, describe your goal, edit variants, then publish ",
    },
    {
      icon: <EditIcon />,
      id: "create-experiment-2",
      title: "Create an experiment",
      description: "Select the target, describe your goal, edit variants, then publish ",
    },
    {
      icon: <EditIcon />,
      id: "create-experiment-3",
      title: "Create an experiment",
      description: "Select the target, describe your goal, edit variants, then publish ",
    },
  ]

  // Show loading state during SSR and initial client render
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Project not found</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
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
          <div className="flex flex-col">
            <p className="text-xs text-gray-500">Project</p>
            <div className="flex flex-row gap-2 items-center">
              <h1 className="font-semibold">{project.name}</h1>
              <div className="flex flex-row gap-2 items-center"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-12">
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <QuickAction key={action.id} projectId={projectId} {...action} />
          ))}
        </div>
      </div>

      <div className="px-4 py-2 flex flex-row gap-2 items-center justify-between">
        <p className="text-text-primary font-medium text-sm">Experiments ({experiments.length})</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-t border-b border-border-light bg-canvas">
            <tr className="text-left">
              <th className="px-4 py-3 border-r border-border-light">
                <div className="flex flex-row gap-2 items-center">
                  <input type="checkbox" className="rounded-full border-gray-300" />
                  <p className="text-xs text-text-secondary font-medium">Name</p>
                </div>
              </th>
              <th className="px-4 py-3 border-r border-border-light">
                <p className="text-xs text-text-secondary font-medium">URL</p>
              </th>
              <th className="px-4 py-3 border-r border-border-light">
                <p className="text-xs text-text-secondary font-medium">Status</p>
              </th>
              <th className="px-4 py-3 border-r border-border-light">
                <p className="text-xs text-text-secondary font-medium">Created</p>
              </th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {experiments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No experiments yet. Create your first experiment to get started.
                </td>
              </tr>
            ) : (
              experiments.map((experiment) => (
                <tr key={experiment.id} className="hover:bg-gray-25 transition-colors">
                  <td className="px-4 py-3 text-sm border-r border-border-light">
                    <div className="flex flex-row gap-2 items-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <Link href={`/projects/${projectId}/experiments/${experiment.id}`} className="text-xs text-text-primary font-medium hover:underline">
                        {experiment.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm border-r border-border-light">
                    <p className="text-xs text-text-secondary font-medium">{experiment.url}</p>
                  </td>
                  <td className="px-4 py-3 border-r border-border-light">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">Active</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs border-r border-border-light">
                    {new Date(experiment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

function QuickAction({icon, title, description, featured, projectId}: {icon: React.ReactNode, title: string, description: string, featured?: boolean, projectId: string}) {
  return (
    <Link href={`/projects/${projectId}/experiments/new`} className={`flex flex-col gap-2 p-6 border border-border-light rounded-xl hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer ${featured ? "bg-white" : "bg-gray-25"}`}>
      {icon}
      <div className="flex flex-col gap-1 mt-8">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-gray-500 text-xs">{description}</p>
      </div>
    </Link>
  )
}
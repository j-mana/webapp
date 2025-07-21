'use client'

import { useState } from "react"
import { motion } from "motion/react"
import ChevronDownIcon from "@/icons/ChevronDownIcon"
import ChevronRightIcon from "@/icons/ChevronRightIcon"
import SidebarIcon from "@/icons/SidebarIcon"
import { usePathname } from "next/navigation"
import Link from "next/link"
import HomeIcon from "@/icons/HomeIcon"
import CubeIcon from "@/icons/CubeIcon"
import CodeIcon from "@/icons/CodeIcon"
import SearchIcon from "@/icons/SearchIcon"
import { useUIStore } from "@/store/useUIStore"
import Image from "next/image"
import UserIcon from "@/icons/UserIcon"
import { useData } from "./DataProvider"
import Button from "./Button"
import { createProject } from "@/lib/db-mutations"

export default function Sidebar() {
  const pathname = usePathname()
  const [bookmarksExpanded, setBookmarksExpanded] = useState(true)
  const [projectsExpanded, setProjectsExpanded] = useState(true)
  const { projects, experiments } = useData()
  
  // Calculate activeProject based on pathname
  const getActiveProjectIndex = () => {
    if (pathname === '/projects/1') return 0
    if (pathname === '/projects/2') return 1
    if (pathname === '/projects/3') return 2
    return -1 // No active project
  }

  const getActiveBookmarkIndex = () => {
    if (pathname === '/projects/1/experiments/1') return 0
    if (pathname === '/projects/1/experiments/2') return 1
    return -1 // No active bookmark
  }
  
  const activeProject = getActiveProjectIndex()
  const activeBookmark = getActiveBookmarkIndex()
  const { toggleSidebar } = useUIStore((state) => state)
  
  return (
    <div className="w-64 h-dvh bg-canvas border-r border-border-light flex-shrink-0 p-4 gap-6 flex flex-col">
      <div className="flex flex-row gap-2">
        <div className="h-9 w-9 bg-white border border-border-light rounded-md overflow-hidden">
          <Image src="/italic-logo.png" alt="Logo" width={36} height={12} />
        </div>
        <div className="flex flex-col">
          <p className="text-base font-medium">
            John A.
          </p>
          <p className="text-xs text-gray-500">Italic</p>
        </div>
        <motion.div className="ml-auto" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} transition={{ duration: 0.2, delay: 0.2 }}>
          <div onClick={toggleSidebar} className="cursor-pointer hover:text-gray-600 text-gray-400 transition-colors duration-200">
            <SidebarIcon size={14}/>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col gap-2">
        <SidebarItem icon={<HomeIcon size={14}/>} label="Home" href="/"/>
        <SidebarItem icon={<UserIcon size={14}/>} label="Customers" href="/customers"/>
        <SidebarItem icon={<CubeIcon size={14}/>} label="Brand" href="/brand"/>
        <SidebarItem icon={<CodeIcon size={14}/>} label="API" href="/api_docs"/>
        <SidebarItem icon={<SearchIcon size={14}/>} label="Search" href="/search"/>
      </div>

      <div className="flex flex-col gap-2">
        <button 
          onClick={() => setBookmarksExpanded(!bookmarksExpanded)}
          className="flex flex-row gap-2 items-center hover:opacity-80 transition-opacity"
        >
          <p className="text-base font-medium text-text-secondary">Bookmarks</p>
          <motion.div
            animate={{ rotate: bookmarksExpanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon size={8} className="text-text-secondary"/>
          </motion.div>
        </button>

        <motion.div 
          className="flex flex-col relative overflow-hidden"
          initial={false}
          animate={{ 
            height: bookmarksExpanded ? "auto" : 0,
            opacity: bookmarksExpanded ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          {activeBookmark !== -1 && (
            <motion.div 
              className="absolute left-0 w-[1.5px] h-4 bg-black z-10"
              initial={false}
              animate={{ 
                y: activeBookmark * 32 + 8 // 32px per item + 8px offset to center
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
            />
          )}
          {experiments.map((experiment) => (
            <NestedSidebarItem 
              key={experiment.id}
              icon={<SidebarIcon size={14}/>} 
              label={experiment.name} 
              active={pathname === `/projects/${experiment.project?.id}/experiments/${experiment.id}`}
              href={`/projects/${experiment.project?.id}/experiments/${experiment.id}`}
            />
          ))}
        </motion.div>
      </div>

      <div className="flex flex-col gap-2">
        <button 
          onClick={() => setProjectsExpanded(!projectsExpanded)}
          className="flex flex-row gap-2 items-center hover:opacity-80 transition-opacity"
        >
          <p className="text-base font-medium text-text-secondary">Projects</p>
          <motion.div
            animate={{ rotate: projectsExpanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon size={8} className="text-text-secondary"/>
          </motion.div>
        </button>

        <Button variant="normal" className="w-full" onClick={async () => {
          await createProject('New Project')
        }}>
          {/* <PlusIcon size={14}/> */}
          New Project
        </Button>

        <motion.div 
          className="flex flex-col relative"
          initial={false}
          animate={{ 
            height: projectsExpanded ? "auto" : 0,
            opacity: projectsExpanded ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          {activeProject !== -1 && (
            <motion.div 
              className="absolute left-0 w-[1.5px] h-4 bg-black z-10"
              initial={false}
              animate={{ 
                y: activeProject * 32 + 8 // 32px per item + 8px offset to center
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
            />
          )}
          {projects.map((project) => (
            <NestedSidebarItem 
              key={project.id}
              icon={<SidebarIcon size={14}/>} 
              label={project.name} 
              active={pathname === `/projects/${project.id}`}
              href={`/projects/${project.id}`}
            />
          ))}
        </motion.div>
      </div>

      <div className="mt-auto">
        <Image src="/logo.svg" alt="Logo" width={200} height={200} className="w-28" />
      </div>
    </div>
  )
}

const SidebarItem = ({icon, label, href}: {icon: React.ReactNode, label: string, href?: string}) => {
  return (
    <Link href={href || ''} className="flex flex-row gap-2 items-center text-text-primary">
      {icon}  
      <p className="text-sm font-medium text-text-primary">{label}</p>
    </Link>
  )
}

const NestedSidebarItem = ({icon, label, active=false, onClick, href}: {icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, href?: string}) => {
  const content = (
    <>
      <div className={`h-full relative flex flex-col items-center justify-center w-[1.5px] bg-border-light`}>
        {/* Removed the individual black bar since we're using a shared animated one */}
      </div>

      <div className={`border w-full px-2 py-1.5 transition-all duration-300 ${active ? 'bg-white subtle-shadow rounded-lg border-border-light' : 'border-transparent'}`}>
        <p className="text-base text-text-primary">
          {label}
        </p>
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className="flex flex-row items-center gap-2">
        {content}
      </Link>
    )
  }

  return (
    <div className="flex flex-row items-center gap-2 cursor-pointer" onClick={onClick}>
      {content}
    </div>
  )
}
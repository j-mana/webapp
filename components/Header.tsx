import ZapfastIcon from "@/icons/ZapfastIcon";
import Button from "./Button";
import GithubIcon from "@/icons/GithubIcon";
import SettingsIcon from "@/icons/SettingsIcon";
import SidebarIcon from "@/icons/SidebarIcon";
import ChevronRightIcon from "@/icons/ChevronRightIcon";
import { useUIStore } from "@/store/useUIStore"
import { AnimatePresence, motion } from "motion/react";

export default function Header() {
  const { toggleSidebar, sidebarOpen } = useUIStore((state) => state)

  return (
    <div className='flex flex-row bg-white flex-shrink-0 py-2 px-4 justify-between'>
      <div className='flex flex-row gap-2 items-center w-full mt-0.5'>
        
        <AnimatePresence mode="popLayout">
          {!sidebarOpen && (
            <motion.div 
              className="flex flex-row gap-2 items-center" 
              initial={{ x: -20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: -20, opacity: 0 }} 
              transition={{ duration: 0.2, delay: 0.2 }}
              layout
            >
              <div onClick={toggleSidebar} className="cursor-pointer hover:text-gray-600 text-gray-400 transition-colors duration-200">
                <SidebarIcon size={14}/>
              </div>
              <ChevronRightIcon size={12} className="text-gray-400"/>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.p 
          className='text-base text-text-primary' 
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          On & Lowe marketing campaign June 2025
        </motion.p>
      </div>

      <div className='flex flex-row gap-2 items-center'>
        
        <Button variant='icon'>
          <SettingsIcon size={14}/>
        </Button>
        <Button variant='icon'>
          <GithubIcon size={14}/>
        </Button>
        <Button variant='skeuomorphic'>
          <p className='text-base text-white'>Publish</p>
          <ZapfastIcon size={14} className="text-white"/>
        </Button>
      </div>
    </div>
  )
}
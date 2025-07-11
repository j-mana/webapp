'use client'

import { useUIStore } from '@/store/useUIStore'
import Sidebar from '@/components/Sidebar'
import { AnimatePresence, motion } from 'motion/react'

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  
  return (
    <div className="relative h-dvh overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="absolute left-0 top-0 z-10"
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="h-full overflow-auto"
        animate={{ 
          paddingLeft: sidebarOpen ? 256 : 0
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
'use client'

import { useState } from "react";
import Header from "@/components/Header";
import { AnimatePresence, motion } from "motion/react";
import SidebarIcon from "@/icons/SidebarIcon";
import ChevronRightIcon from "@/icons/ChevronRightIcon";
import { useUIStore } from "@/store/useUIStore";


export default function SearchPage() {
  const { toggleSidebar, sidebarOpen } = useUIStore((state) => state)
  return(
    <div className="h-dvh w-full flex flex-col p-4">
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
        
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Search</h1>
        </div>
    </div>
  )
}
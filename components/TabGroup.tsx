'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
}

interface TabGroupProps {
  tabs: Tab[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
}

export default function TabGroup({ tabs, defaultTab, onTabChange, className = '' }: TabGroupProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <div className={`flex flex-row gap-1 w-fit ${className}`}>
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`relative cursor-pointer flex flex-row items-center gap-1 rounded-md px-2 py-1 w-max transition-colors duration-200 ${
            activeTab === tab.id
              ? 'text-gray-900' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId={`activeTab-${tabs.map(t => t.id).join('-')}`}
              className="absolute inset-0 border border-border-light subtle-shadow rounded-md bg-white"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            />
          )}
          <div className="relative z-10 flex flex-row items-center gap-1">
            {tab.icon}
            <p className="text-base font-medium">{tab.label}</p>
          </div>
        </motion.button>
      ))}
    </div>
  )
} 
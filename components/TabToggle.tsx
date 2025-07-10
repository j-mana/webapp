'use client'

import { motion } from 'motion/react'

interface TabToggleProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
  groupId?: string
}

export default function TabToggle({ icon, label, active = false, onClick, groupId = 'default' }: TabToggleProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative cursor-pointer flex flex-row items-center gap-1 rounded-md px-2 py-1 w-max transition-colors duration-200 ${
        active 
          ? 'text-gray-900' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {active && (
        <motion.div
          layoutId={`activeTab-${groupId}`}
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
        {icon}
        <p className="text-base font-medium">{label}</p>
      </div>
    </motion.button>
  )
}
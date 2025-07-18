import { motion } from "motion/react"

export default function ChatMessage({message, role}: {message: string, role: 'user' | 'assistant'}) {
  return (
    <motion.div className={`flex flex-row gap-2 items-center text-left ${role === 'user' ? 'bg-gray-75 ml-auto max-w-[80%] px-3 py-2 rounded-xl' : 'bg-white'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <p className='text-xs text-text-primary'>{message}</p>
    </motion.div>
  )
}
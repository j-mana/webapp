import LayoutAltIcon from "@/icons/LayoutAltIcon";
import PaintPourIcon from "@/icons/PaintPourIcon";
import SendIcon from "@/icons/SendIcon";
import TextInputIcon from "@/icons/TextInputIcon";
import { useEffect, useState } from "react";

export default function ChatInput({recommendationsLocation = 'top', input, setInput, onSend}: {recommendationsLocation?: 'top' | 'bottom', input: string, setInput: (input: string) => void, onSend: () => void}) {

  const [activeRecommendation, setActiveRecommendation] = useState<string | null>(null)

  useEffect(() => {
    if (activeRecommendation) {
      setInput(`${activeRecommendation}...`)
    } else {
      setInput('')
    }
  }, [activeRecommendation])
  
  return (
    <div className='flex flex-col gap-2 mt-auto'>

      <div className={`flex flex-wrap gap-2 mx-auto items-center justify-center ${recommendationsLocation === 'top' ? '' : 'order-last'}`}>
        <ChatRecommendation label="Personalize hero" icon={<TextInputIcon size={12}/>} active={activeRecommendation === 'personalize'} onClick={() => setActiveRecommendation('personalize')}/>
        <ChatRecommendation label="Improve layout" icon={<LayoutAltIcon size={12}/>} active={activeRecommendation === 'layout'} onClick={() => setActiveRecommendation('layout')}/>
        <ChatRecommendation label="Color CTAs" icon={<PaintPourIcon size={12}/>} active={activeRecommendation === 'ctas'} onClick={() => setActiveRecommendation('ctas')}/>
      </div>

      <div className='flex flex-col gap-2 bg-white rounded-2xl border border-border-light strong-shadow'>
        <textarea 
          className='w-full h-full p-4 resize-none outline-none text-sm' 
          placeholder='Create or edit...' 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        ></textarea>
        <div className='flex flex-row p-2'>
          <div className='px-3 py-1.5 bg-black text-white flex flex-row gap-1 items-center rounded-xl w-max ml-auto cursor-pointer' onClick={() => onSend()}>
            <p className='text-base text-white font-medium'>Send</p>
            <SendIcon size={14}/>
          </div>
        </div>
      </div>
    </div>
  )
}

const ChatRecommendation = ({label, icon, active, onClick}: {label: string, icon: React.ReactNode, active: boolean, onClick: () => void}) => {
  return (
    <div className={`shrink-0 flex flex-row gap-1 items-center border rounded-lg p-1.5 py-1 transition-colors duration-200 ${active ? 'bg-black text-white border-transparent' : 'bg-canvas text-gray-600 border-border-light hover:bg-gray-50 cursor-pointer'}`} onClick={onClick}>
      {icon}
      <p className='text-tiny shrink-0'>{label}</p>
    </div>
  )
}
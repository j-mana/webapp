import ZapfastIcon from "@/icons/ZapfastIcon";
import Button from "./Button";
import GithubIcon from "@/icons/GithubIcon";
import SettingsIcon from "@/icons/SettingsIcon";

export default function Header() {
  return (
    <div className='flex flex-row bg-white flex-shrink-0 py-2 px-4 justify-between'>
      <div className='flex flex-row gap-2 items-center w-full'>
        <p className='text-base text-text-primary'>On & Lowe marketing campaign June 2025</p>
      </div>

      <div className='flex flex-row gap-2 items-center'>
        
        <Button style='icon'>
          <SettingsIcon size={14}/>
        </Button>
        <Button style='icon'>
          <GithubIcon size={14}/>
        </Button>
        <Button style='skeuomorphic'>
          <p className='text-base text-white'>Publish</p>
          <ZapfastIcon size={14} className="text-white"/>
        </Button>
      </div>
    </div>
  )
}
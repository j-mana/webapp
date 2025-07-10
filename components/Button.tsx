export default function Button({style, children}: {style: 'icon' | 'skeuomorphic', children: React.ReactNode}) {
  if(style === 'icon') {
    return (
      <div className='flex flex-row border border-border-light rounded-md p-1.5 hover:bg-gray-50 transition-colors duration-200 cursor-pointer'>
        {children}
      </div>
    )
  } else if(style === 'skeuomorphic') {
    return (
      <div className='flex flex-row gap-2 items-center px-2 py-1 rounded-md w-max skeuomorphic-button skeuomorphic-shadow'>
        {children}
      </div>
    )
  }
}
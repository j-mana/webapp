export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-row">
      {children}
    </div>
  )
}
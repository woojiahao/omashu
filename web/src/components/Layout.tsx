export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="w-[70%] my-12 mx-auto">
      {children}
    </div>
  )
}
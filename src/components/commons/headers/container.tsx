interface Props {
  children?: React.ReactNode
}

export function HeaderPageContainer({ children }: Props) {
  return (
    <div className="sticky top-0 z-50 mx-auto flex w-full max-w-7xl flex-col items-center justify-between bg-white px-6 py-2 shadow-sm">
      {children}
    </div>
  )
}

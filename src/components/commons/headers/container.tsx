interface Props {
  children?: React.ReactNode
}

export function HeaderPageContainer({ children }: Props) {
  return (
    <div className="sticky top-0 z-50 flex w-full items-center justify-between bg-accent shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-2">
        {children}
      </div>
    </div>
  )
}

import { Link } from '@/components/ui/link'

export function FooterByDevNameTitle() {
  return (
    <div className="flex h-32 w-full max-w-screen-xl items-center justify-center text-sm text-zinc-200">
      Desenvolvido com 💜 por{' '}
      <Link
        variant="footer"
        href="https://andrelino.dev/"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1 p-0"
      >
        Andrelino Silva
      </Link>
    </div>
  )
}

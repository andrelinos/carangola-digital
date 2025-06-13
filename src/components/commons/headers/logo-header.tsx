import Image from 'next/image'
import Link from 'next/link'

export function LogoHeader() {
  return (
    <Link href="/" className="flex w-fit items-center justify-center gap-2 p-0">
      <Image
        width={80}
        height={80}
        className="size-auto max-h-11 lg:max-h-16"
        src="/logo-blue.svg"
        alt="Logo Carangola Digital"
        priority
      />
      <h2 className="max-w-[112px] font-bold text-sm opacity-90 lg:text-xl">
        Carangola Digital
      </h2>
    </Link>
  )
}

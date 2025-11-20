import { Link } from '@/components/ui/link'

const mockListings = [
  {
    type: 'business',
    title: 'André Assistência Técnica',
    tags: ['Assistência Técnica', 'Serviços'],
    imageUrl:
      'https://carangoladigital.com.br/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fcarangola-digital.firebasestorage.app%2Fprofiles-images%2Fandrelino%2Flogo-images%2Ff72be423-d2e7-4ec6-b049-9d3d20379dc4%3FGoogleAccessId%3Dfirebase-adminsdk-fbsvc%2540carangola-digital.iam.gserviceaccount.com%26Expires%3D16725225600%26Signature%3DCgYQfHcESHAVIqIrwD38SOXC8w3TNyTTD9MWQx%252FZmS8A7vDbd297T%252B4rju3JthAqmH3sy0jhjONzL4u%252F3kXHdOQ1c2xWFYxSxF63DmNjYbDY17gsrQaApK1QWmC%252Bf%252FGxSsnLRE7OO7TrcaRTkUtdVOrKhA%252F2ffX%252BOIRh%252FGDCMQgSgBPdCSQ3M21%252B1A7l%252Fv%252ByJfLbxRslmpWXT%252BCVFD1%252FuxFSKrnkKs8546P977lGdjnl3bCdF%252Byuj6XuD3c%252BLhZGdZk5t3cVUwtK7nZfWXkBi5CCtwwVncqC7PEC%252F%252B9rqfRMHaeOJDldS9Q2L4v5RVIc2ZiJcVTs2v4PLIsAsWBUQQ%253D%253D&w=1920&q=75',
    href: '/business/andrelino',
  },
  {
    type: 'business',
    title: 'Rodrigo Celulares',
    tags: ['Assistência Técnica', 'Serviços', 'Celulares e Acessórios'],
    imageUrl:
      'https://carangoladigital.com.br/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fcarangola-digital.firebasestorage.app%2Fprofiles-images%2FBJlnJ6fDD91woXkKPUZA%2Flogo-images%2Fc1e1b360-28bb-4885-8b47-3eee094fb9f4%3FGoogleAccessId%3Dfirebase-adminsdk-fbsvc%2540carangola-digital.iam.gserviceaccount.com%26Expires%3D16725225600%26Signature%3DaH0hVT5z01JMCTefMEjJD%252BRaYKz9g4FTaP6jwayhaAvRXyU0eiVSmEqsj9Mb%252BTeOoMuKomAkHQtSbc0YydxznRxORp34%252BNPSKss2d3m0QZX%252BexGoTAFNBC1orXSbQlwB1HMSkaY6eYSxFP8DbDI%252BW%252B4Ng1%252BSkfrpRW6qnhmmutaq9EixAvTHY%252F9Q3g0QLQrRAPysPoUT2n23WkKE5McJmb4iB9i3axonrWSBtzWqB0WgsWZREB9YcueTOhQ7TPddOdfLaCVSJW4%252BIJ1x222PCEP6i1d%252Fb2rNEruGL0EI3aefRSkvcarrEBGvMOjy3CcaG611nZlzukq7uc9XmovQJg%253D%253D&w=1920&q=75',
    href: '/business/rodrigo-celulares',
  },
]

export function RecentListings() {
  const listings = mockListings

  return (
    <section className="bg-slate-100 py-16 md:py-20 dark:bg-slate-800/50">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center font-bold text-3xl text-slate-900 dark:text-slate-100">
          Destaques
        </h2>
        <div className="grid grid-cols-1 justify-center gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((item, index) => (
            <Link
              variant="unstyled"
              key={String(index)}
              href={item.href}
              className="group hover:-translate-y-1 overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-2 truncate font-semibold text-lg text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                {item.type === 'business' && 'tags' in item && (
                  <div className="flex flex-wrap gap-2">
                    {item?.tags?.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 text-xs dark:bg-blue-900/50 dark:text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

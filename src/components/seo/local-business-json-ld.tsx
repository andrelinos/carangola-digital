import type { ProfileDataProps, Schedule } from '@/_types/profile-data'

// Função auxiliar para agrupar dias com horários iguais
const formatOpeningHours = (schedule: Schedule | undefined | null) => {
  if (!schedule) return []

  const groups: Record<
    string,
    { days: string[]; opens: string; closes: string }
  > = {}

  // Mapeamento de chaves do Schedule para nomes de dias da semana em inglês (Schema.org)
  const dayMap: Record<string, string> = {
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',
    Sunday: 'Sunday',
  }

  Object.entries(schedule).forEach(([dayKey, details]) => {
    const dayName = dayMap[dayKey]
    if (!dayName || !details || details.closed) return

    // Para o Schema.org simplificado, pegamos o primeiro intervalo
    const firstInterval = details.intervals?.[0]
    if (!firstInterval) return

    const timeKey = `${firstInterval.opening}-${firstInterval.closing}`

    if (!groups[timeKey]) {
      groups[timeKey] = {
        days: [],
        opens: firstInterval.opening,
        closes: firstInterval.closing,
      }
    }
    groups[timeKey].days.push(dayName)
  })

  return Object.values(groups).map(group => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: group.days,
    opens: group.opens,
    closes: group.closes,
  }))
}

export default function LocalBusinessJsonLd({
  data,
}: {
  data: ProfileDataProps
}) {
  // Converte socialMedias para o array sameAs do Schema.org
  const sameAs = data.socialMedias
    ? Object.values(data.socialMedias).filter(link => !!link)
    : []

  const firstAddress = data.businessAddresses?.[0]

  const jsonLd = {
    '@context': 'http://schema.org/',
    '@type': 'LocalBusiness',
    name: data.name,
    image: data.coverImagePath || data.logoImagePath,
    telephone: data.businessPhones?.[0]?.phone || '',
    url: `https://carangoladigital.com.br/business/${data.slug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: firstAddress?.address || '',
      addressLocality: 'Carangola',
      addressRegion: 'MG',
      postalCode: firstAddress?.cep || '',
      addressCountry: 'BR',
    },
    openingHoursSpecification: formatOpeningHours(data.openingHours),
    sameAs: sameAs,
  }

  if (data.rating && data.reviewCount > 0) {
    // @ts-expect-error
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.rating,
      reviewCount: data.reviewCount,
    }
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  )
}

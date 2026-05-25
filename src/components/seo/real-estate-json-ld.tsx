import type { PropertyProps } from '@/_types/property'

export default function RealEstateListingJsonLd({
  data,
}: {
  data: PropertyProps
}) {
  const url = `https://carangoladigital.com.br/imoveis/${data.slug}`

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'RealEstateListing',
    name: data.title,
    description: data.description,
    url: url,
    image: data.images?.[0]?.url || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address,
      addressLocality: data.city || 'Carangola',
      addressRegion: data.state || 'MG',
      postalCode: data.cep,
      addressCountry: 'BR',
    },
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      category: data.listingType === 'Venda' ? 'For Sale' : 'For Rent',
    },
    numberOfRooms: data.characteristics?.bedrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: data.characteristics?.area,
      unitCode: 'MTK',
    },
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  )
}

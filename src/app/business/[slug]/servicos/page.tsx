import { AdsComponentAdmin } from './_components/ad-component-admin'

export default function Property() {
  const data = [
    {
      id: '1',
      title: 'Apartamento Central',
      type: 'Apartamento',
      listingType: 'Venda',
      status: 'Disponível',
      price: 'R$ 350.000',
      address: 'Centro, Carangola - MG',
      bedrooms: 3,
      bathrooms: 2,
    },
    {
      id: '2',
      title: 'Casa com jardim',
      type: 'Casa',
      listingType: 'Aluguel',
      status: 'Alugado',
      price: 'R$ 1.800/mês',
      address: 'Bairro Santa Cruz',
      bedrooms: 4,
      bathrooms: 3,
    },
  ]

  return <AdsComponentAdmin data={data} />
}

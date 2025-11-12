import { AdsComponentAdmin } from './_components/ad-component-admin'

export default function Property() {
  const data = [
    {
      id: '1',
      title: 'Apartamento Central',
      type: 'Apartamento',
      listingType: 'Venda',
      status: 'Disponível',
      price: 350000,
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
      price: 1800,
      address: 'Bairro Santa Cruz',
      bedrooms: 4,
      bathrooms: 3,
    },
  ]

  return <AdsComponentAdmin data={data} />
}

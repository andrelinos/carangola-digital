'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'
import { toast } from 'sonner'

const MapPage = dynamic(() => import('./map'), {
  ssr: false,
})

import type { PropertyProps } from '@/_types/property'

import {
  type PropertyAddressProps,
  createOrUpdatePropertyAddress,
} from '@/actions/properties/property-create-update-address'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/custom-modal'
import { Input } from '@/components/ui/input'

interface Props {
  data: PropertyProps | null
}

const defaultAddress: PropertyAddressProps = {
  address: '',
  neighborhood: '',
  cep: '',
  latitude: -20.73385181091924,
  longitude: -42.03013264654137,
}

export function EditPropertyAddresses({ data }: Props) {
  const router = useRouter()
  const propertyId = data?.id || ''

  const dataProperty = {
    ...data,
    address: data?.address ?? '',
    neighborhood: data?.neighborhood ?? '',
    cep: data?.cep ?? '',
    longitude: data?.longitude ?? defaultAddress.longitude,
    latitude: data?.latitude ?? defaultAddress.latitude,
  }

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGettingAddress, setIsGettingAddress] = useState(false)

  const [formValues, setFormValues] =
    useState<PropertyAddressProps>(dataProperty)

  function handleOpenModal() {
    setIsOpen(true)
  }

  function onClose() {
    setIsOpen(false)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSaveAddresses() {
    setIsSubmitting(true)

    if (!propertyId) {
      return toast.error('Erro ao salvar informações, faltou o ID')
    }

    try {
      const formData = new FormData()
      formData.append('propertyId', propertyId)
      formData.append('address', JSON.stringify(formValues))

      await createOrUpdatePropertyAddress(formData)
      toast.success('Endereço salvo com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar o endereço.')
      return false
    } finally {
      startTransition(() => {
        setIsSubmitting(false)
        onClose()
        router.refresh()
      })
    }
  }

  const handleGetAddressFromCoords = async (latlng: [number, number]) => {
    setIsGettingAddress(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng[0]}&lon=${latlng[1]}&format=json`
      )
      const data = await response.json()

      if (data?.address) {
        setFormValues(prev => ({
          ...prev,
          address: data.address.road || prev.address,
          cep: data.address.postcode || prev.cep,
          neighborhood: data.address.suburb || prev.neighborhood,
        }))
      }
    } catch {
      console.error('Failed to fetch address')
    } finally {
      setIsGettingAddress(false)
    }
  }

  const coordinates: [number, number] = [
    formValues.latitude,
    formValues.longitude,
  ]

  return (
    <>
      <ButtonForOwnerOnly handleExecute={handleOpenModal} title="endereço" />

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Endereço do imóvel"
        description="Informe o endereço"
        classname="w-full max-w-lg justify-center border-[0.5px] border-blue-300 text-zinc-700 bg-white p-6"
      >
        <div className="items-end-safe lg:fex-row flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto py-6">
          <div className="flex w-full flex-col gap-4 ">
            <div className="relative mt-6 flex w-full flex-1 flex-col text-zinc-700">
              <div className="flex w-full gap-4">
                <div className="flex w-full flex-1 flex-col gap-4 text-zinc-700">
                  <h2 className="font-bold">Endereço</h2>
                  <div className="flex flex-col gap-4">
                    <Input
                      name="address"
                      variant="ghost"
                      title="Endereço"
                      placeholder="Rua Pedro de Oliveira, 9999"
                      value={formValues.address}
                      onChange={handleChange}
                    />
                    <div className="flex gap-4">
                      <Input
                        name="neighborhood"
                        variant="ghost"
                        title="Bairro"
                        placeholder="Centro"
                        value={formValues.neighborhood}
                        onChange={handleChange}
                      />
                      <div className="max-w-[156px]">
                        <Input
                          name="cep"
                          variant="ghost"
                          title="CEP"
                          placeholder="36800-000"
                          value={formValues.cep}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      name="latitude"
                      variant="ghost"
                      title="Latitude"
                      placeholder="-20.73370461095738"
                      value={formValues.latitude}
                      onChange={handleChange}
                    />
                    <Input
                      type="number"
                      name="longitude"
                      variant="ghost"
                      title="Longitude"
                      placeholder="-42.0299412669833"
                      value={formValues.longitude}
                      onChange={handleChange}
                    />
                  </div>

                  <MapPage
                    coordinates={coordinates}
                    setCoordinates={(newCoords: [number, number]) => {
                      setFormValues(prev => ({
                        ...prev,
                        latitude: newCoords[0],
                        longitude: newCoords[1],
                      }))

                      handleGetAddressFromCoords(newCoords)
                    }}
                  />
                </div>
                {/* O botão de deletar foi removido */}
              </div>
            </div>
          </div>

          {/* O botão "Adicionar novo endereço" foi removido */}

          <div>
            <p className="text-center text-sm text-zinc-600">
              <strong>Nota</strong>: O endereço é de{' '}
              <strong>Carangola/MG</strong>. Por isso não precisa informar a{' '}
              <strong>cidade</strong> ou <strong>estado</strong>.
            </p>
          </div>

          <footer className="flex w-full justify-end gap-4 pt-6">
            <button
              type="button"
              className="font-bold hover:cursor-pointer"
              onClick={onClose}
            >
              Voltar
            </button>
            <Button
              onClick={handleSaveAddresses}
              disabled={isSubmitting}
              className="min-w-[120px] font-bold "
            >
              Salvar
            </Button>
          </footer>
        </div>
      </Modal>

      {isSubmitting && <Loading />}
      {isGettingAddress && <Loading title="Carregando dados do endereço..." />}
    </>
  )
}

'use client'

import { Plus, Trash } from 'iconoir-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'
import { toast } from 'sonner'

import type { BusinessAddressProps } from '@/_types/profile-data'

import { createBusinessAddress } from '@/actions/business/create-business-address'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/custom-modal'
import { Input } from '@/components/ui/input'
import { defaultCoordinates } from '@/configs/address/default-coordinates'

const MapPage = dynamic(() => import('./map'), {
  ssr: false,
})

interface Props {
  data: {
    businessAddresses: BusinessAddressProps[] | null
    profileId: string
  }
}

export function EditBusinessAddresses({ data }: Props) {
  const router = useRouter()
  const profileId = data.profileId

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGettingAddress, setIsGettingAddress] = useState(false)

  const [formValues, setFormValues] = useState<BusinessAddressProps[] | null>(
    data.businessAddresses || [
      {
        title: 'Endereço 1',
        address: '',
        neighborhood: '',
        cep: '',
        latitude: defaultCoordinates.latitude,
        longitude: defaultCoordinates.longitude,
      },
    ]
  )

  // const [addressFromMap, setAddressFromMap] = useState({
  //   address: '',
  //   postcode: '',
  // })

  function handleOpenModal() {
    setIsOpen(!isOpen)
  }

  function onClose() {
    setIsOpen(false)
  }

  function handleNewAddress() {
    if (formValues?.length && formValues?.length >= 2) {
      toast.info('Em breve você poderá adicionar mais endereços.', {
        description: 'Ainda estamos trabalhando nisso.',
        position: 'top-center',
      })

      return
    }

    setFormValues(prevState => [
      ...(prevState ?? []),
      {
        title: `Endereço ${(prevState?.length ?? 0) + 1}`,
        address: '',
        neighborhood: '',
        cep: '',
        latitude: -20.73385181091924,
        longitude: -42.03013264654137,
      },
    ])
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof BusinessAddressProps
  ) {
    setFormValues(prevState => {
      if (!prevState) return prevState
      const updatedAddresses = [...prevState]
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        [field]: event.target.value,
        title: `Endereço ${index + 1}`,
      }
      return updatedAddresses
    })
  }

  async function handleSaveAddresses() {
    setIsSubmitting(true)

    if (!formValues || formValues.length === 0) {
      setIsSubmitting(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('profileId', profileId)
      formData.append('addresses', JSON.stringify(formValues))

      await createBusinessAddress(formData)
      toast.success('Endereços salvos com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar os endereços.')
      return false
    } finally {
      startTransition(() => {
        setIsSubmitting(false)
        onClose()

        router.refresh()
      })
    }
  }

  function handleDeleteAddress(event: React.MouseEvent<HTMLButtonElement>) {
    if (!event || !event.currentTarget || !event.currentTarget.dataset.index)
      return
    const index = Number.parseInt(event.currentTarget.dataset.index ?? '0', 10)
    setFormValues(prev => (prev ? prev.filter((_, i) => i !== index) : null))
  }

  const handleGetAddressFromCoords = async (
    latlng: [number, number],
    index: number
  ) => {
    setIsGettingAddress(true)
    let apiAddress = ''
    let apiCep = ''

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng[0]}&lon=${latlng[1]}&format=json`
      )

      if (response.ok) {
        const data = await response.json()

        if (data) {
          apiAddress = data.address.road ?? ''
          apiCep = data.address.postcode ?? ''
        }
        //   if (data?.address) {
        //     setFormValues(prevState => {
        //       if (!prevState) return prevState
        //       const updatedAddresses = [...prevState]
        //       updatedAddresses[index] = {
        //         ...updatedAddresses[index],
        //         address: data.address.road ?? '',
        //         cep: data.address.postcode ?? '',
        //       }
        //       return updatedAddresses
        //     })
        //   }
        // }
        // return true
      }
    } catch {
      return true
    } finally {
      setFormValues(prevState => {
        if (!prevState) return prevState
        const updatedAddresses = [...prevState]
        const currentData = updatedAddresses[index]

        updatedAddresses[index] = {
          ...currentData,
          // 1. Atualiza as coordenadas
          latitude: latlng[0],
          longitude: latlng[1],

          // 2. A LÓGICA QUE VOCÊ PEDIU:
          // Se 'currentData.address' tiver valor ("truthy"), use-o.
          // Senão (se for ''), use o 'apiAddress'.
          address: currentData.address || apiAddress,

          // O mesmo para o CEP
          cep: currentData.cep || apiCep,
        }
        return updatedAddresses
      })
      setIsGettingAddress(false)
    }
  }

  const defaultLatitude = -20.73385181091924
  const defaultLongitude = -42.03013264654137

  return (
    <>
      <ButtonForOwnerOnly handleExecute={handleOpenModal}>
        Editar
      </ButtonForOwnerOnly>

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Endereços"
        description="Informe seus endereços"
        classname="w-full max-w-lg justify-center rounded-2xl border-[0.5px] border-blue-300 text-zinc-700 bg-white p-6"
      >
        <div className="items-end-safe lg:fex-row flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto py-6">
          <div className="flex w-full flex-col gap-4 ">
            {formValues?.map((item, index) => {
              const coordinates: [number, number] = [
                typeof item.latitude === 'number' && item.latitude !== 0
                  ? item.latitude
                  : defaultLatitude,
                typeof item.longitude === 'number' && item.latitude !== 0
                  ? item.longitude
                  : defaultLongitude,
              ]
              return (
                <div
                  key={String(index)}
                  className="relative mt-6 flex w-full flex-1 flex-col text-zinc-700"
                >
                  <div className="flex w-full gap-4">
                    <div className="flex w-full flex-1 flex-col gap-4 text-zinc-700">
                      <h2 className="font-bold">
                        Endereço {String(index + 1)}
                      </h2>
                      <div className="flex flex-col gap-4">
                        <Input
                          name="address"
                          variant="ghost"
                          title="Endereço"
                          placeholder="Rua Pedro de Oliveira, 9999"
                          value={item?.address ?? ''}
                          onChange={e => handleChange(e, index, 'address')}
                        />
                        <div className="flex gap-4">
                          <Input
                            name="district"
                            variant="ghost"
                            title="Bairro"
                            placeholder="Centro"
                            value={item?.neighborhood ?? ''}
                            onChange={e =>
                              handleChange(e, index, 'neighborhood')
                            }
                          />
                          <div className="max-w-[156px]">
                            <Input
                              name="cep"
                              variant="ghost"
                              title="cep"
                              placeholder="36800-000"
                              value={item?.cep ?? ''}
                              onChange={e => handleChange(e, index, 'cep')}
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
                          value={item?.latitude ?? ''}
                          onChange={e => handleChange(e, index, 'latitude')}
                        />
                        <Input
                          type="number"
                          name="longitude"
                          variant="ghost"
                          title="Longitude"
                          placeholder="-42.0299412669833"
                          value={item?.longitude ?? ''}
                          onChange={e => handleChange(e, index, 'longitude')}
                        />
                      </div>

                      <MapPage
                        coordinates={coordinates}
                        setCoordinates={(newCoords: [number, number]) => {
                          handleGetAddressFromCoords(newCoords, index)

                          // setFormValues(prevState => {
                          //   if (!prevState) return prevState
                          //   const updatedAddresses = [...prevState]
                          //   updatedAddresses[index] = {
                          //     ...updatedAddresses[index],
                          //     latitude: newCoords[0],
                          //     longitude: newCoords[1],
                          //     address: addressFromMap.address,
                          //     cep: addressFromMap.postcode,
                          //   }
                          //   return updatedAddresses
                          // })
                        }}
                      />
                    </div>
                    <div className="">
                      <Button
                        data-index={index}
                        variant="link"
                        className="size-4 p-0 text-rose-400 transition-all duration-300 hover:animate-bounce hover:cursor-pointer"
                        onClick={handleDeleteAddress}
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex w-full justify-end">
            <Button variant="secondary" onClick={handleNewAddress}>
              <Plus /> Adicionar novo endereço
            </Button>
          </div>

          <div>
            <p className="text-center text-sm text-zinc-600">
              <strong>Nota</strong>: Todos os endereços são de{' '}
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

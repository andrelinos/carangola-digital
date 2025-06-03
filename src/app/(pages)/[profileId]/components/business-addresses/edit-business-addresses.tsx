'use client'

import { EditPencil, Plus, Trash } from 'iconoir-react'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import type { BusinessAddressProps } from '@/_types/profile-data'

import { createBusinessAddress } from '@/actions/create-business-address'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import Link from 'next/link'
import { toast } from 'sonner'

interface Props {
  data: BusinessAddressProps[] | null
}

export function EditBusinessAddresses({ data }: Props) {
  const router = useRouter()
  const profileId = useParams().profileId as string

  const initialAddresses: BusinessAddressProps[] = [
    {
      title: 'Endereço 1',
      address: '',
      neighborhood: '',
      cep: '',
      latitude: '',
      longitude: '',
    },
    {
      title: 'Endereço 2',
      address: '',
      neighborhood: '',
      cep: '',
      latitude: '',
      longitude: '',
    },
  ]

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formValues, setFormValues] = useState<BusinessAddressProps[] | null>(
    data || [
      {
        title: 'Endereço 1',
        address: '',
        neighborhood: '',
        cep: '',
        latitude: '',
        longitude: '',
      },
    ]
  )

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
        latitude: '',
        longitude: '',
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
  return (
    <>
      <ButtonForOwnerOnly handleExecute={handleOpenModal}>
        <EditPencil className="size-4 transition-all duration-300 hover:scale-150 hover:cursor-pointer" />
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
              return (
                <div
                  key={String(index)}
                  className="mt-6 flex w-full flex-1 text-zinc-700"
                >
                  <div className="flex w-full flex-1 flex-col gap-4 text-zinc-700">
                    <h2 className="font-bold">Endereço {String(index + 1)}</h2>
                    <div className="flex flex-col gap-4">
                      <Input
                        name="address"
                        variant="ghost"
                        title="Endereço"
                        placeholder="Rua Pedro de Oliveira, 9999"
                        value={item.address}
                        onChange={e => handleChange(e, index, 'address')}
                      />
                      <div className="flex gap-4">
                        <Input
                          name="district"
                          variant="ghost"
                          title="Bairro"
                          placeholder="Centro"
                          value={item.neighborhood}
                          onChange={e => handleChange(e, index, 'neighborhood')}
                        />
                        <div className="max-w-[156px]">
                          <Input
                            name="cep"
                            variant="ghost"
                            title="cep"
                            placeholder="36800-000"
                            value={item.cep}
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
                        value={item.latitude}
                        onChange={e => handleChange(e, index, 'latitude')}
                      />
                      <Input
                        type="number"
                        name="longitude"
                        variant="ghost"
                        title="Longitude"
                        placeholder="-42.0299412669833"
                        value={item.longitude}
                        onChange={e => handleChange(e, index, 'longitude')}
                      />
                    </div>

                    <p className="text-xs">
                      Para conseguir a latitude e longitude você precisar
                      acessar o{' '}
                      <Link
                        href="https://google.com/maps"
                        className="text-blue-500"
                        target="_blank"
                      >
                        Google Maps
                      </Link>{' '}
                      pelo computador e copiar.
                    </p>
                  </div>
                  <div className="">
                    <Button
                      data-index={index}
                      variant="link"
                      className="size-4 p-0 text-rose-400 transition-all duration-300 hover:scale-125 hover:cursor-pointer"
                      onClick={handleDeleteAddress}
                    >
                      <Trash className="size-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex w-full justify-end">
            <Button
              variant="link"
              className="m-0 flex items-center py-0 text-xs hover:cursor-pointer hover:text-blue-500"
              onClick={handleNewAddress}
            >
              <Plus /> Adicionar no endereço
            </Button>
          </div>

          <div>
            <p className="text-center text-sm text-zinc-600">
              <strong>Nota</strong>: Todos os endereços são de{' '}
              <strong>Carangola/MG</strong>. Por isso não precisa informar a{' '}
              <strong>cidade</strong> ou <strong>estado</strong>.
            </p>
          </div>

          <footer className="flex justify-end gap-4">
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
              className="w-32"
            >
              Salvar
            </Button>
          </footer>
        </div>
      </Modal>
      {isSubmitting && <Loading />}
    </>
  )
}

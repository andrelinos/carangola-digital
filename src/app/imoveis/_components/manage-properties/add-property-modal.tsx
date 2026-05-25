'use client'

import { Home, ListPlus, MapPin, Ruler } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'
import { toast } from 'sonner'
import { createNewProperty } from '@/actions/properties/create-property'
import { FooterEditModal } from '@/components/commons/footer-edit-modal'
import { Loading } from '@/components/commons/loading'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const propertyTypes = [
  'Apartamento',
  'Casa',
  'Terreno',
  'Loja Comercial',
  'Sítio/Fazenda',
]

const listingTypes = ['Venda', 'Aluguel', 'Temporada']
const propertyStatus = ['Disponível', 'Reservado', 'Alugado', 'Vendido']
const featuresItems = [
  'Ar condicionado',
  'Armários embutidos',
  'Varanda',
  'Portaria 24h',
  'Elevador',
  'Salão de festas',
  'Piscina',
  'Churrasqueira',
  'Academia',
  'Área de serviço',
]

const initialPropertyState = {
  title: '',
  type: '',
  listingType: '',
  status: 'Disponível',
  price: '',
  address: '',
  zipCode: '',
  description: '',
  area: 0,
  bedrooms: 0,
  bathrooms: 0,
  garageSpots: 0,
  yearBuilt: 0,
  features: [] as string[],
}

export function AddPropertyModal({ isOpen, onClose }: Props) {
  const router = useRouter()
  const [newProperty, setNewProperty] = useState(initialPropertyState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [displayPrice, setDisplayPrice] = useState('')

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setNewProperty(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  function handlePriceChange(event: React.ChangeEvent<HTMLInputElement>) {
    const onlyDigits = event.target.value.replace(/\D/g, '')

    if (!onlyDigits) {
      setDisplayPrice('')
      setNewProperty(prev => ({ ...prev, price: '' }))
      return
    }

    const numericValue = Number(onlyDigits) / 100
    const formatted = numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    setDisplayPrice(formatted)
    setNewProperty(prev => ({
      ...prev,
      price: Number(onlyDigits) as any,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewProperty(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFeaturesChange = (feature: string) => {
    setNewProperty(prev => {
      const currentFeatures = prev.features
      if (currentFeatures.includes(feature)) {
        return {
          ...prev,
          features: currentFeatures.filter(f => f !== feature),
        }
      }
      return { ...prev, features: [...currentFeatures, feature] }
    })
  }

  const handleCreateProperty = async () => {
    setIsSubmitting(true)
    try {
      const { title, price, address, zipCode } = newProperty
      if (!title || price === '' || !address || !zipCode) {
        toast.warning('Campos obrigatórios')
        return
      }
      const formData = new FormData()
      formData.append('newProperty', JSON.stringify(newProperty))

      await createNewProperty(formData)

      toast.success('Imóvel cadastrado com sucesso!')
      onClose()
      setNewProperty(initialPropertyState)
      setDisplayPrice('')
    } catch (error) {
      console.error('Erro ao criar imóvel:', error)
      toast.error('Falha ao cadastrar imóvel.')
    } finally {
      startTransition(() => {
        setIsSubmitting(false)
        onClose()
        router.refresh()
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onInteractOutside={event => event.preventDefault()}
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto bg-white p-0 sm:rounded-2xl dark:bg-slate-900"
      >
        <div className="sticky top-0 z-10 border-slate-100 border-b bg-white/80 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
          <DialogHeader>
            <DialogTitle className="font-black text-2xl text-slate-900 tracking-tight dark:text-slate-100">
              Cadastrar Novo Imóvel
            </DialogTitle>
            <p className="text-slate-500 text-sm dark:text-slate-400">
              Preencha os dados abaixo para anunciar sua propriedade.
            </p>
          </DialogHeader>
        </div>

        <div className="space-y-10 px-6 py-6 md:px-8">
          {/* Informações Principais */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-slate-100 border-b pb-2 dark:border-slate-800">
              <Home className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                Informações Principais
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label
                  htmlFor="title"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Título do Anúncio *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={newProperty.title}
                  onChange={handleFormChange}
                  placeholder="Ex: Lindo apartamento com vista para o mar"
                  required
                  className="h-11 bg-slate-50 transition-colors focus:bg-white dark:bg-slate-800/50 dark:focus:bg-slate-800"
                />
              </div>
              <div className="space-y-2.5">
                <Label
                  htmlFor="price"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Valor (R$) *
                </Label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 font-medium text-slate-400">
                    R$
                  </span>
                  <Input
                    type="text"
                    id="price"
                    name="price"
                    value={displayPrice}
                    onChange={handlePriceChange}
                    placeholder="0,00"
                    required
                    className="h-11 bg-slate-50 pl-10 font-medium transition-colors focus:bg-white dark:bg-slate-800/50 dark:focus:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2.5">
                <Label
                  htmlFor="type"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Tipo de Imóvel
                </Label>
                <Select
                  name="type"
                  value={newProperty.type}
                  onValueChange={value => handleSelectChange('type', value)}
                >
                  <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-800/50">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label
                  htmlFor="listingType"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Finalidade
                </Label>
                <Select
                  name="listingType"
                  value={newProperty.listingType}
                  onValueChange={value =>
                    handleSelectChange('listingType', value)
                  }
                >
                  <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-800/50">
                    <SelectValue placeholder="Venda ou Aluguel" />
                  </SelectTrigger>
                  <SelectContent>
                    {listingTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label
                  htmlFor="status"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Status
                </Label>
                <Select
                  name="status"
                  value={newProperty.status}
                  onValueChange={value => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-800/50">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyStatus.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-slate-100 border-b pb-2 dark:border-slate-800">
              <MapPin className="h-5 w-5 text-rose-500" />
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                Localização
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2.5 md:col-span-2">
                <Label
                  htmlFor="address"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Endereço Completo *
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={newProperty.address}
                  onChange={handleFormChange}
                  placeholder="Ex: Avenida Brasil, 1500 - Centro"
                  className="h-11 bg-slate-50 transition-colors focus:bg-white dark:bg-slate-800/50 dark:focus:bg-slate-800"
                />
              </div>
              <div className="space-y-2.5">
                <Label
                  htmlFor="zipCode"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  CEP *
                </Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={newProperty.zipCode}
                  onChange={handleFormChange}
                  placeholder="00000-000"
                  className="h-11 bg-slate-50 transition-colors focus:bg-white dark:bg-slate-800/50 dark:focus:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Detalhes do Imóvel */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-slate-100 border-b pb-2 dark:border-slate-800">
              <Ruler className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                Dimensões e Estrutura
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-5">
              <div className="space-y-2.5">
                <Label
                  htmlFor="bedrooms"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Quartos
                </Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  value={newProperty.bedrooms}
                  onChange={handleFormChange}
                  className="h-11 bg-slate-50 text-center font-medium text-lg transition-colors focus:bg-white dark:bg-slate-800/50 dark:focus:bg-slate-800"
                />
              </div>
              <div className="space-y-2.5">
                <Label
                  htmlFor="bathrooms"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Banheiros
                </Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  value={newProperty.bathrooms}
                  onChange={handleFormChange}
                  className="h-11 bg-slate-50 text-center font-medium text-lg transition-colors focus:bg-white dark:bg-slate-800/50 dark:focus:bg-slate-800"
                />
              </div>
              <div className="space-y-2.5">
                <Label
                  htmlFor="garageSpots"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Vagas
                </Label>
                <Input
                  id="garageSpots"
                  name="garageSpots"
                  type="number"
                  value={newProperty.garageSpots}
                  onChange={handleFormChange}
                  className="h-11 bg-slate-50 text-center font-medium text-lg transition-colors focus:bg-white dark:bg-slate-800/50 dark:focus:bg-slate-800"
                />
              </div>
              <div className="space-y-2.5">
                <Label
                  htmlFor="area"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Área (m²)
                </Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  value={newProperty.area}
                  onChange={handleFormChange}
                  className="h-11 bg-slate-50 text-center font-medium text-lg transition-colors focus:bg-white dark:bg-slate-800/50 dark:focus:bg-slate-800"
                />
              </div>
              <div className="col-span-2 space-y-2.5 md:col-span-1">
                <Label
                  htmlFor="yearBuilt"
                  className="font-semibold text-slate-700 dark:text-slate-300"
                >
                  Construção
                </Label>
                <Input
                  id="yearBuilt"
                  name="yearBuilt"
                  type="number"
                  value={newProperty.yearBuilt}
                  onChange={handleFormChange}
                  placeholder="Ex: 2015"
                  className="h-11 bg-slate-50 text-center font-medium text-lg transition-colors focus:bg-white dark:bg-slate-800/50 dark:focus:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Descrição e Diferenciais */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-slate-100 border-b pb-2 dark:border-slate-800">
              <ListPlus className="h-5 w-5 text-emerald-500" />
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                Mais Detalhes
              </h3>
            </div>
            <div className="space-y-2.5">
              <Label
                htmlFor="description"
                className="font-semibold text-slate-700 dark:text-slate-300"
              >
                Descrição do Imóvel
              </Label>
              <Textarea
                id="description"
                name="description"
                value={newProperty.description}
                onChange={handleFormChange}
                rows={5}
                className="resize-none bg-slate-50 p-4 leading-relaxed transition-colors focus:bg-white dark:bg-slate-800/50 dark:focus:bg-slate-800"
                placeholder="Descreva as características do imóvel, vizinhança, pontos de interesse próximos e diferenciais que o tornam especial..."
              />
            </div>

            <div className="space-y-3 pt-4">
              <Label className="font-semibold text-slate-700 dark:text-slate-300">
                Diferenciais do Imóvel
              </Label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {featuresItems.map(feature => {
                  const isSelected = newProperty.features.includes(feature)
                  return (
                    <div
                      key={feature}
                      onClick={() => handleFeaturesChange(feature)}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 shadow-sm dark:border-blue-500/50 dark:bg-blue-500/10'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <Checkbox
                        id={feature}
                        checked={isSelected}
                        onCheckedChange={() => handleFeaturesChange(feature)}
                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                        onClick={e => e.stopPropagation()}
                      />
                      <Label
                        htmlFor={feature}
                        className="cursor-pointer font-medium text-slate-700 text-sm dark:text-slate-300"
                        onClick={e => e.stopPropagation()}
                      >
                        {feature}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 border-slate-100 border-t pt-6 dark:border-slate-800">
            <FooterEditModal
              isSubmitting={isSubmitting}
              onClose={onClose}
              onSave={handleCreateProperty}
            />
          </div>
        </div>
      </DialogContent>
      {isSubmitting && <Loading />}
    </Dialog>
  )
}

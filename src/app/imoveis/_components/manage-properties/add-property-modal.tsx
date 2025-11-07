'use client'

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
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'
import { toast } from 'sonner'

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

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setNewProperty(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  // Handler genérico para Selects
  const handleSelectChange = (name: string, value: string) => {
    setNewProperty(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handler para Checkboxes de Features
  const handleFeaturesChange = (feature: string) => {
    setNewProperty(prev => {
      const currentFeatures = prev.features
      if (currentFeatures.includes(feature)) {
        // Remove
        return {
          ...prev,
          features: currentFeatures.filter(f => f !== feature),
        }
      }
      // Adiciona
      return { ...prev, features: [...currentFeatures, feature] }
    })
  }

  // Simula o salvamento
  const handleCreateProperty = async () => {
    setIsSubmitting(true)
    try {
      const { title, price, address, zipCode } = newProperty
      if (!title || !price || !address || !zipCode) {
        toast.warning('Campos obrigatórios')
        return
      }
      const formData = new FormData()
      formData.append('newProperty', JSON.stringify(newProperty))

      await createNewProperty(formData)

      toast.success('Imóvel cadastrado com sucesso!')
      onClose()
      setNewProperty(initialPropertyState)
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
        className="max-h-screen w-full max-w-3xl overflow-y-auto bg-white px-6 py-16 md:rounded-2xl md:px-8 dark:bg-gray-800"
      >
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Imóvel</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Título e Preço */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Anúncio</Label>
              <Input
                id="title"
                name="title"
                value={newProperty.title}
                onChange={handleFormChange}
                placeholder="Ex: Casa com 3 quartos"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Valor (R$)</Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={newProperty.price}
                onChange={handleFormChange}
                placeholder="Ex: 35000"
                required
              />
            </div>
          </div>

          {/* Tipo, Finalidade e Status */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                name="type"
                value={newProperty.type}
                onValueChange={value => handleSelectChange('type', value)}
              >
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label htmlFor="listingType">Finalidade</Label>
              <Select
                name="listingType"
                value={newProperty.listingType}
                onValueChange={value =>
                  handleSelectChange('listingType', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a finalidade" />
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
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={newProperty.status}
                onValueChange={value => handleSelectChange('status', value)}
              >
                <SelectTrigger>
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

          {/* Endereço e CEP */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                name="address"
                value={newProperty.address}
                onChange={handleFormChange}
                placeholder="Ex: Rua Principal, 123 - Centro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={newProperty.zipCode}
                onChange={handleFormChange}
                placeholder="Ex: 36800-000"
              />
            </div>
          </div>

          {/* Detalhes Numéricos (Quartos, Banheiros, etc.) */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Quartos</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={newProperty.bedrooms}
                onChange={handleFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Banheiros</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={newProperty.bathrooms}
                onChange={handleFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="garageSpots">Vagas</Label>
              <Input
                id="garageSpots"
                name="garageSpots"
                type="number"
                value={newProperty.garageSpots}
                onChange={handleFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Área (m²)</Label>
              <Input
                id="area"
                name="area"
                type="number"
                value={newProperty.area}
                onChange={handleFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearBuilt">Ano de Construção</Label>
              <Input
                id="yearBuilt"
                name="yearBuilt"
                type="number"
                value={newProperty.yearBuilt}
                onChange={handleFormChange}
                placeholder="Ex: 2010"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={newProperty.description}
              onChange={handleFormChange}
              rows={5}
              placeholder="Descreva os detalhes do imóvel..."
            />
          </div>

          {/* Diferenciais (Features) */}
          <div className="space-y-3">
            <Label>Diferenciais (Opcional)</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {featuresItems.map(feature => (
                <div key={feature} className="flex items-center gap-2">
                  <Checkbox
                    id={feature}
                    checked={newProperty.features.includes(feature)}
                    onCheckedChange={() => handleFeaturesChange(feature)}
                  />
                  <Label htmlFor={feature} className="font-normal">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <FooterEditModal
            isSubmitting={isSubmitting}
            onClose={onClose}
            onSave={handleCreateProperty}
          />
        </div>
      </DialogContent>
      {isSubmitting && <Loading />}
    </Dialog>
  )
}

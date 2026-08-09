'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { categories } from '@/assets/data/categories'
import { createServiceListing } from '@/actions/services/create-service-listing'
import { updateServiceListing } from '@/actions/services/update-service-listing'
import type { ServiceListing } from '@/_types/service-listing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ServiceFormProps {
  initialData?: ServiceListing
}

const serviceAreaLabels: Record<string, string> = {
  local: 'Apenas no local do prestador',
  citywide: 'Em toda a cidade',
  'home-service': 'Atendimento a domicílio',
}

export function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(
    initialData?.description ?? ''
  )
  const [category, setCategory] = useState(initialData?.category ?? '')
  const [priceType, setPriceType] = useState<'fixed' | 'from' | 'on-request'>(
    initialData?.priceType ?? 'on-request'
  )
  const [price, setPrice] = useState(
    initialData?.price ? String(initialData.price / 100) : ''
  )
  const [serviceArea, setServiceArea] = useState<
    'local' | 'citywide' | 'home-service'
  >(initialData?.serviceArea ?? 'citywide')
  const [neighborhood, setNeighborhood] = useState(
    initialData?.neighborhood ?? ''
  )
  const [contactWhatsApp, setContactWhatsApp] = useState(
    initialData?.contactWhatsApp ?? ''
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !description.trim() || !category) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    setIsPending(true)

    const priceInCents =
      priceType !== 'on-request' && price
        ? Math.round(Number.parseFloat(price.replace(',', '.')) * 100)
        : undefined

    if (isEditing && initialData?.id) {
      const result = await updateServiceListing({
        id: initialData.id,
        title,
        description,
        category,
        priceType,
        price: priceInCents,
        serviceArea,
        neighborhood: neighborhood || null,
        contactWhatsApp: contactWhatsApp || null,
      })

      setIsPending(false)

      if (!result.success) {
        setError(result.error ?? 'Erro ao atualizar serviço.')
        return
      }
    } else {
      const result = await createServiceListing({
        title,
        description,
        category,
        priceType,
        price: priceInCents,
        serviceArea,
        neighborhood: neighborhood || undefined,
        contactWhatsApp: contactWhatsApp || undefined,
      })

      setIsPending(false)

      if (!result.success) {
        setError(result.error ?? 'Erro ao criar serviço.')
        return
      }
    }

    router.push('/dashboard/servicos')
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      {/* Title */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="service-title">
          Título do serviço <span className="text-destructive">*</span>
        </Label>
        <Input
          id="service-title"
          placeholder="Ex: Pintura residencial, Aulas de violão..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={100}
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="service-description">
          Descrição <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="service-description"
          placeholder="Descreva o serviço, sua experiência, diferenciais..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={5}
          maxLength={1000}
          required
        />
        <p className="text-muted-foreground text-xs">
          {description.length}/1000 caracteres
        </p>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="service-category">
          Categoria <span className="text-destructive">*</span>
        </Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger id="service-category">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="service-price-type">Tipo de preço</Label>
          <Select
            value={priceType}
            onValueChange={v =>
              setPriceType(v as 'fixed' | 'from' | 'on-request')
            }
          >
            <SelectTrigger id="service-price-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Preço fixo</SelectItem>
              <SelectItem value="from">A partir de</SelectItem>
              <SelectItem value="on-request">Consultar preço</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {priceType !== 'on-request' && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="service-price">Valor (R$)</Label>
            <Input
              id="service-price"
              type="number"
              placeholder="0,00"
              step="0.01"
              min="0"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Service area */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="service-area">Área de atendimento</Label>
        <Select
          value={serviceArea}
          onValueChange={v =>
            setServiceArea(v as 'local' | 'citywide' | 'home-service')
          }
        >
          <SelectTrigger id="service-area">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(serviceAreaLabels).map(([val, label]) => (
              <SelectItem key={val} value={val}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Neighborhood */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="service-neighborhood">Bairro (opcional)</Label>
        <Input
          id="service-neighborhood"
          placeholder="Ex: Centro, Santa Cruz..."
          value={neighborhood}
          onChange={e => setNeighborhood(e.target.value)}
        />
      </div>

      {/* WhatsApp */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="service-whatsapp">WhatsApp para contato</Label>
        <Input
          id="service-whatsapp"
          type="tel"
          placeholder="(32) 99999-9999"
          value={contactWhatsApp}
          onChange={e => setContactWhatsApp(e.target.value)}
        />
        <p className="text-muted-foreground text-xs">
          Clientes entrarão em contato diretamente pelo WhatsApp informado.
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive text-sm">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/servicos')}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing
              ? 'Salvando...'
              : 'Criando...'
            : isEditing
              ? 'Salvar alterações'
              : 'Criar serviço'}
        </Button>
      </div>
    </form>
  )
}

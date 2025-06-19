'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Clock,
  Download,
  ExternalLink,
  Facebook,
  Gift,
  Globe,
  Images,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Star,
  StarHalf,
} from 'lucide-react'
import Link from 'next/link'

export function BusinessProfileDemo() {
  const businessHours = [
    { day: 'Segunda - Sexta', hours: '07:00 - 20:00' },
    { day: 'Sábado', hours: '08:00 - 18:00' },
    { day: 'Domingo', hours: '09:00 - 16:00' },
  ]

  const galleryImages = [
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300',
  ]

  const reviews = [
    {
      name: 'Maria Silva',
      rating: 5,
      comment:
        'Ambiente incrível e café delicioso! O atendimento é sempre muito atencioso. Virou meu lugar favorito para trabalhar.',
      date: 'há 2 dias',
    },
    {
      name: 'João Santos',
      rating: 4,
      comment:
        'Ótimos cafés especiais e preço justo. O ambiente é perfeito para reuniões de trabalho.',
      date: 'há 1 semana',
    },
  ]

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-3xl text-gray-900 md:text-4xl">
            Veja como seu negócio ficará
          </h2>
          <p className="text-gray-600 text-lg">
            Exemplo de perfil de estabelecimento na plataforma
          </p>
        </div>

        <Card className="overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Cover Photo */}
          <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600"
              alt="Modern coffee shop interior"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <CardContent className="p-8">
            {/* Business Header */}
            <div className="mb-8 flex items-start space-x-6">
              <div className="-mt-16 relative z-10 h-24 w-24 rounded-2xl bg-white p-4 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                  alt="Coffee shop logo"
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>
              <div className="flex-1 pt-8">
                <h1 className="mb-2 font-bold text-3xl text-gray-900">
                  Café Aroma Especial
                </h1>
                <p className="mb-4 text-gray-600 text-lg">
                  Café artesanal com grãos selecionados e ambiente aconchegante.
                  Perfeito para trabalhar ou relaxar com amigos.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <StarHalf className="h-4 w-4 fill-current" />
                    </div>
                    <span className="ml-2 font-semibold text-gray-900">
                      4.7
                    </span>
                    <span className="ml-1 text-gray-600">/ 5</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">235 avaliações</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <div>
                    <span className="text-gray-700">
                      Rua das Flores, 123 - Centro
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      className="ml-2 h-auto p-0 text-primary"
                    >
                      Ver no mapa
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-secondary" />
                  <span className="text-gray-700">(11) 99999-9999</span>
                  <Button
                    size="sm"
                    className="bg-secondary text-white hover:bg-green-700"
                  >
                    Ligar
                  </Button>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">
                    contato@aromaespecial.com
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <Link href="#" className="text-primary hover:text-blue-700">
                    aromaespecial.com
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <Link href="#" className="text-pink-600 hover:text-pink-700">
                    <Instagram className="h-6 w-6" />
                  </Link>
                  <Link href="#" className="text-blue-600 hover:text-blue-700">
                    <Facebook className="h-6 w-6" />
                  </Link>
                  <Link
                    href="#"
                    className="text-green-600 hover:text-green-700"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <Card className="mb-8 bg-gray-50">
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center font-semibold text-gray-900 text-lg">
                  <Clock className="mr-2 h-5 w-5 text-gray-600" />
                  Horário de Funcionamento
                </h3>
                <div className="grid gap-4 text-sm md:grid-cols-2">
                  {businessHours.map((schedule, index) => (
                    <div key={String(index)} className="flex justify-between">
                      <span className="text-gray-600">{schedule.day}</span>
                      <span className="font-medium text-gray-900">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-secondary text-white"
                    >
                      • Aberto agora
                    </Badge>
                    <span className="text-gray-600">Fecha às 20:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photo Gallery */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center font-semibold text-gray-900 text-lg">
                <Images className="mr-2 h-5 w-5 text-gray-600" />
                Galeria de Fotos
              </h3>
              <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
                {galleryImages.map((image, index) => (
                  <img
                    key={String(index)}
                    src={image}
                    alt={`Ambiente do café ${index + 1}`}
                    className="aspect-square cursor-pointer rounded-lg object-cover transition-transform hover:scale-105"
                  />
                ))}
              </div>
            </div>

            {/* Special Offer */}
            <Card className="mb-8 border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-2 flex items-center font-semibold text-gray-900 text-lg">
                      <Gift className="mr-2 h-5 w-5 text-yellow-600" />
                      Oferta Especial
                    </h3>
                    <p className="mb-2 text-gray-700">
                      Mostre este QR Code e ganhe 10% de desconto em cafés
                      especiais!
                    </p>
                    <span className="text-gray-600 text-sm">
                      Válido até 31/12/2024
                    </span>
                  </div>
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white shadow-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-800 text-white text-xs">
                      QR
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Menu/Catalog */}
            <Card className="mb-8 bg-primary bg-opacity-5">
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center font-semibold text-gray-900 text-lg">
                  <Download className="mr-2 h-5 w-5 text-gray-600" />
                  Cardápio
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-2 text-gray-700">
                      Confira nosso cardápio completo com cafés especiais, doces
                      e salgados
                    </p>
                    <div className="flex space-x-4">
                      <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver Online
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Reviews */}
            <div className="mb-8">
              <h3 className="mb-6 flex items-center font-semibold text-gray-900 text-lg">
                <Star className="mr-2 h-5 w-5 text-gray-600" />
                Avaliações de Clientes
              </h3>
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <Card key={String(index)} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                          <span className="font-medium text-gray-600 text-sm">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {review.name}
                            </span>
                            <div className="flex text-sm text-yellow-400">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={String(i)}
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">
                            {review.comment}
                          </p>
                          <span className="text-gray-500 text-xs">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  variant="ghost"
                  className="w-full font-medium text-primary"
                >
                  Ver todas as avaliações
                </Button>
              </div>
            </div>

            {/* Share Button */}
            <div className="flex justify-center">
              <Button className="rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white hover:bg-gray-800">
                <Share2 className="mr-2 h-5 w-5" />
                Compartilhar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

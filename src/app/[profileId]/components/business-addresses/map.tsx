'use client'

import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet/dist/leaflet.css'

import { MapPinPlus as MapIcon, Map as MapIconButton } from 'iconoir-react'
import { useEffect, useRef, useState } from 'react'

import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'

import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { LocateFixed } from 'lucide-react'

type MapClickHandlerProps = {
  setCoordinates: (latlng: [number, number]) => void
}

interface Props {
  coordinates: [number, number]
  setCoordinates: (latlng: [number, number]) => void
}

const MapClickHandler = ({ setCoordinates }: MapClickHandlerProps) => {
  useMapEvents({
    click: e => {
      setCoordinates([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

const LocationUpdater = ({
  onLocationFound,
}: {
  onLocationFound: (latlng: [number, number]) => void
}) => {
  const map = useMap()
  useEffect(() => {
    const handleLocationFound = (e: any) => {
      onLocationFound([e.latlng.lat, e.latlng.lng])
    }
    map.on('locationfound', handleLocationFound)
    return () => {
      map.off('locationfound', handleLocationFound)
    }
  }, [map, onLocationFound])
  return null
}

const LocationButton = ({ onLocate }: { onLocate: () => void }) => {
  return (
    <Button
      variant="ghost"
      onClick={onLocate}
      className="flex size-12 items-center justify-center rounded-xl border border-gray-300 bg-white p-0 shadow-xl hover:cursor-pointer"
      title="Minha localização atual"
    >
      <LocateFixed className="size-8" />
    </Button>
  )
}

export const MapPage = ({ coordinates, setCoordinates }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] =
    useState<[number, number]>(coordinates)

  const mapRef = useRef<any>(null)

  function handleOpenModal() {
    setIsOpen(true)
  }

  function onCloseMap() {
    setIsOpen(false)
  }

  function onSetCoordinatesAndCloseMap() {
    setCoordinates(selectedPosition)
    setIsOpen(false)
  }

  const handleLocate = () => {
    if (mapRef.current) {
      mapRef.current.locate({
        setView: true,
        maxZoom: 20,
        zoom: 20,
        watch: false,
      })
    }
  }

  const SetMapRef = () => {
    const map = useMap()
    mapRef.current = map
    return null
  }

  useEffect(() => {
    setSelectedPosition(coordinates)
  }, [coordinates])

  const zoom = 20

  return (
    <>
      <Button
        variant="default"
        onClick={handleOpenModal}
        className="ml-auto flex size-fit gap-1 bg-zinc-200 text-zinc-700 shadow-xl hover:bg-zinc-600 hover:text-white"
      >
        <MapIconButton className="size-4 transition-all duration-300 hover:scale-150 hover:cursor-pointer" />
        <span className="text-xs">Selecionar no mapa</span>
      </Button>

      <Modal
        isOpen={isOpen}
        setIsOpen={onCloseMap}
        classname="absolute inset-0"
      >
        <div className="absolute inset-x-0 bottom-6 z-[999] flex justify-end gap-2 bg-white/80 px-6">
          <Button
            variant="ghost"
            onClick={onCloseMap}
            className="hover:cursor-pointer"
          >
            Voltar
          </Button>
          <Button
            className="max-w-xs px-6"
            onClick={onSetCoordinatesAndCloseMap}
          >
            Selecionar
          </Button>
          <LocationButton onLocate={handleLocate} />
        </div>

        <MapContainer
          center={selectedPosition}
          zoom={zoom}
          scrollWheelZoom={false}
          className="size-full hover:cursor-crosshair"
        >
          <SetMapRef />
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={selectedPosition}>
            <MapIcon className="size-4" />
          </Marker>

          <MapClickHandler
            setCoordinates={(newCoords: [number, number]) => {
              setSelectedPosition(newCoords)
            }}
          />

          <LocationUpdater
            onLocationFound={(newCoords: [number, number]) => {
              setSelectedPosition(newCoords)
            }}
          />
        </MapContainer>
      </Modal>
    </>
  )
}

export default MapPage

import type { ChangeEvent } from 'react'

export function handleImageInput(e: ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0] ?? null

  if (file) {
    const imageURL = URL.createObjectURL(file)
    return imageURL
  }
  return null
}

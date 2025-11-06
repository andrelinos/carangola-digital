'use client'

import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/custom-modal'
import { useState } from 'react'

interface indexProps {
  plans: any
}

export function ManagePlans({ plans }: indexProps) {
  const [isOpen, setIsOpen] = useState(false)

  function handleOpenModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className="mb-auto flex h-full w-full bg-accent">
        <Button onClick={handleOpenModal}>Adicionar plano</Button>
        {plans?.map((plan: any) => (
          <div key={plan.planId}>
            <h1>{plan.name}</h1>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <h1>Modal</h1>
      </Modal>
    </>
  )
}

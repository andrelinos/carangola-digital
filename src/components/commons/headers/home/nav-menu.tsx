import { cn } from '@/lib/utils'
import { ChatBubbleQuestion } from 'iconoir-react'
// NOVO: Importe os ícones que vamos usar.
// Lembre-se de instalar a biblioteca: npm install @phosphor-icons/react
import { Search, Store } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

// O Radix mudou a forma de importação, esta é a recomendada
import * as RadixMenu from '@radix-ui/react-navigation-menu'
import * as React from 'react'

import clsx from 'clsx'

interface NavProps {
  className?: string
}

export function NavigationMenu({ className }: NavProps) {
  return (
    <RadixMenu.Root
      className={clsx('relative z-10 flex w-fit justify-end', className)}
    >
      <RadixMenu.List className="right-0 m-0 flex list-none rounded-md p-1">
        {/* --- Menu Encontrar (MODIFICADO) --- */}
        <RadixMenu.Item>
          <RadixMenu.Trigger className="group flex select-none items-center justify-center gap-0.5 rounded px-3 py-2 font-medium text-[15px] leading-none outline-none hover:bg-blue-400 hover:text-white focus:shadow-[0_0_0_2px] focus:shadow-violet7">
            Encontrar
            <ChevronDown
              className="group-data-[state=open]:-rotate-180 relative top-px text-violet10 transition-transform duration-[250] ease-in"
              aria-hidden
            />
          </RadixMenu.Trigger>
          <RadixMenu.Content
            // ALTERADO: Ajustes no container do menu
            className="absolute top-0 left-0 w-full rounded-lg bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 data-[motion=from-end]:animate-enterFromRight data-[motion=from-start]:animate-enterFromLeft data-[motion=to-end]:animate-exitToRight data-[motion=to-start]:animate-exitToLeft sm:w-auto"
          >
            {/* ALTERADO: Trocamos o grid por uma lista vertical simples com gap e tamanho definido */}
            <ul className="flex w-[380px] flex-col gap-1 p-2">
              <ListItem
                href="/business"
                title="Estabelecimentos comerciais"
                // NOVO: Passando o ícone como prop
                icon={<Store size={20} className="text-blue-500" />}
              >
                Encontre estabelecimentos comerciais na cidade
              </ListItem>

              {/* NOVO: Divisória sutil */}
              <hr className="border-gray-200/70" />

              <ListItem
                href="/achados-e-perdidos"
                title="Achados e Perdidos"
                icon={<Search size={20} className="text-green-500" />}
              >
                Se perdeu ou encontrou algo, um pet, a carteira ou outro,
                anuncie aqui
              </ListItem>

              <hr className="border-gray-200/70" />

              <ListItem
                href="/como-funciona"
                title="Como funciona"
                icon={<ChatBubbleQuestion className="text-purple-500" />}
              >
                Veja como ajudamos a encontrar ou devolver seu bem
              </ListItem>
            </ul>
          </RadixMenu.Content>
        </RadixMenu.Item>

        {/* --- Menu Overview (Não modificado, mas o princípio é o mesmo) --- */}
        <RadixMenu.Item>
          <RadixMenu.Trigger className="group flex select-none items-center justify-between gap-0.5 rounded px-3 py-2 font-medium text-[15px] text-violet11 leading-none outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-violet7">
            Overview{' '}
            <ChevronDown
              className="group-data-[state=open]:-rotate-180 relative top-px text-violet10 transition-transform duration-[250] ease-in"
              aria-hidden
            />
          </RadixMenu.Trigger>
          <RadixMenu.Content className="absolute top-0 left-0 w-full shadow-black sm:w-auto">
            <ul className="m-0 grid list-none gap-x-2.5 p-[22px] sm:w-[600px] sm:grid-flow-col sm:grid-rows-3">
              {/* Você pode aplicar a mesma lógica de ícones aqui se desejar */}
              <ListItem
                title="Introduction"
                href="/primitives/docs/overview/introduction"
              >
                Build high-quality, accessible design systems and web apps.
              </ListItem>
              {/* ... outros itens ... */}
            </ul>
          </RadixMenu.Content>
        </RadixMenu.Item>

        <RadixMenu.Indicator className="top-full z-10 flex h-2.5 items-end justify-center overflow-hidden transition-[width,transform_250ms_ease] data-[state=hidden]:animate-fadeOut data-[state=visible]:animate-fadeIn">
          <div className="relative top-[70%] size-2.5 rotate-45 rounded-tl-sm bg-white" />
        </RadixMenu.Indicator>
      </RadixMenu.List>

      <div className="perspective-[2000px] absolute top-full left-0 flex w-full justify-center">
        <RadixMenu.Viewport className="relative mt-2.5 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-md bg-white transition-[width,_height] duration-300 data-[state=closed]:animate-scaleOut data-[state=open]:animate-scaleIn sm:w-[var(--radix-navigation-menu-viewport-width)]" />
      </div>
    </RadixMenu.Root>
  )
}

// ALTERADO: Adicionamos a prop 'icon'
interface Props {
  className?: string
  children: React.ReactNode // Alterado para React.ReactNode para mais flexibilidade
  title: string
  href: string
  icon?: React.ReactNode // NOVO: prop para o ícone
}

// --- Componente ListItem (MODIFICADO) ---
const ListItem = React.forwardRef<HTMLAnchorElement, Props>(
  ({ className, children, title, icon, ...props }, forwardedRef) => (
    <li>
      <RadixMenu.Link asChild>
        <Link
          className={cn(
            // ALTERADO: Ajustes de padding e estilo de hover/focus
            'block select-none rounded-md p-3 text-[15px] leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:shadow-[0_0_0_2px] focus:shadow-gray-400',
            className
          )}
          {...props}
          ref={forwardedRef}
        >
          {/* NOVO: Wrapper flex para alinhar ícone e texto */}
          <div className="flex items-start gap-4">
            {/* Renderiza o ícone se ele for passado */}
            {icon && <div className="mt-0.5">{icon}</div>}

            {/* Container para o texto */}
            <div>
              {/* ALTERADO: Classes de texto para melhor hierarquia */}
              <div className="mb-1 font-semibold text-gray-900 leading-tight">
                {title}
              </div>
              <p className="text-gray-600 text-sm leading-snug">{children}</p>
            </div>
          </div>
        </Link>
      </RadixMenu.Link>
    </li>
  )
)

ListItem.displayName = 'ListItem' // Boa prática para depuração

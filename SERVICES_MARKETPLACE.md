# Marketplace de Serviços — Carangola Digital

> **Status:** `PENDENTE` — aguardando decisões de produto (ver seção "Decisões Abertas")
> **Criado em:** 2026-08-03
> **Referência de inspiração:** https://site.lavou.app/servicos

---

## Contexto

O projeto já possui três pilares:

| Pilar | Rota | Status |
|---|---|---|
| Guia Comercial | `/business` | ✅ Produção |
| Imóveis | `/imoveis` | ✅ Produção |
| **Marketplace de Serviços** | `/servicos` | ⏳ Planejado |

> [!NOTE]
> A rota `/business/[slug]/servicos` **já existe** mas contém apenas dados mock
> (`src/app/business/[slug]/servicos/page.tsx`). É o ponto de entrada natural
> para começar a implementação sem criar atrito com a arquitetura atual.

---

## Decisões Abertas (BLOQUEANTES)

> [!IMPORTANT]
> As perguntas abaixo precisam ser respondidas antes de qualquer implementação.
> Elas impactam diretamente o modelo de dados no Firestore e a arquitetura das rotas.

### 1. Escopo do prestador

**Opção A — Extensão do perfil de empresa (menor esforço)**
- Apenas usuários com perfil no `/business` podem publicar serviços
- Serviços ficam vinculados ao `businessProfileId`
- Reaproveitamento máximo do código existente

**Opção B — Prestador independente (maior flexibilidade)**
- Qualquer usuário logado cria um "perfil de prestador"
- Nova coleção Firestore: `service-providers`
- Sem necessidade de ter empresa cadastrada

**Opção C — Híbrido ⭐ (recomendado)**
- Serviços são publicados por qualquer usuário logado
- Se o usuário já tem perfil no guia comercial, os serviços ficam vinculados a ele
- Se não tem, um mini-perfil de prestador é criado automaticamente

---

### 2. Modelo de contato cliente → prestador

- [x] **WhatsApp direto** — link `wa.me/` simples, sem intermediação
- [ ] **Formulário com lead** — lead registrado no Firestore, prestador vê no dashboard
- [ ] **Ambos** — WhatsApp + formulário de backup

> **Impacto:** Se optar por lead interno, precisa de nova coleção `service-leads`
> e notificações (email/push) para o prestador.

---

### 3. Monetização

- [ ] **Gratuito** para todos (validação de mercado)
- [x] **Extensão dos planos** existentes — adicionar campo `serviceListings.quantity` nos planos `free/basic/pro/master`
- [ ] **Plano separado** para prestadores de serviço

> **Sugestão:** Começar grátis com limite de 1 serviço por usuário. Upgrade para
> planos existentes aumenta o limite. Assim reutiliza toda a infra de pagamento (Asaas).

---

### 4. Cadastro do prestador

- [x] Exige perfil completo no guia comercial primeiro
- [ ] Cadastro simplificado: apenas nome + WhatsApp + categoria + serviço

---

### 5. Categorias de serviços

- [x] Reutilizar `src/assets/data/categories.ts` (genérico, já existente)
- [ ] Criar `src/assets/data/service-categories.ts` com categorias específicas de serviços:
  ```
  Diarista, Pedreiro, Pintor, Eletricista, Encanador, Jardineiro,
  Cuidador de Idosos, Babá, Personal Trainer, Motorista, Montador de Móveis,
  Fotógrafo, Designer, Desenvolvedor, Aula Particular, etc.
  ```

---

## Arquitetura Proposta

### Firestore — Nova coleção `service-listings`

```typescript
// src/_types/service-listing.ts (CRIAR)
interface ServiceListing {
  id: string
  businessProfileId?: string  // opcional — vincula ao perfil do /business se existir
  userId: string              // dono do anúncio (obrigatório)
  slug: string                // gerado a partir do título
  title: string
  description: string
  category: string
  tags: string[]

  // Preço
  priceType: 'fixed' | 'from' | 'on-request'
  price?: number              // em centavos se fixed/from

  // Mídia
  images: { path: string; url: string }[]
  thumbnailUrl?: string

  // Atendimento
  serviceArea: 'local' | 'citywide' | 'home-service'
  neighborhood?: string

  // Contato
  contactWhatsApp?: string
  contactPhone?: string
  contactEmail?: string

  // Controle
  isActive: boolean
  isHighlighted: boolean      // destaque pago — aparece no topo

  // Métricas
  rating?: number
  reviewCount: number
  totalVisits: number

  createdAt: number           // timestamp
  updatedAt: number
}
```

---

### Rotas a criar/modificar

#### Públicas (frontend)

| Rota | Arquivo | Ação | Descrição |
|---|---|---|---|
| `/servicos` | `src/app/servicos/page.tsx` | **CRIAR** | Listagem pública de todos os serviços |
| `/servicos/[slug]` | `src/app/servicos/[slug]/page.tsx` | **CRIAR** | Página individual do serviço |
| `/business/[slug]/servicos` | `src/app/business/[slug]/servicos/page.tsx` | **MODIFICAR** | Substituir mock por dados reais |

#### Dashboard (gestão)

| Rota | Arquivo | Ação | Descrição |
|---|---|---|---|
| `/dashboard/servicos` | `src/app/dashboard/servicos/page.tsx` | **CRIAR** | Lista serviços do usuário |
| `/dashboard/servicos/novo` | `src/app/dashboard/servicos/novo/page.tsx` | **CRIAR** | Formulário de criação |
| `/dashboard/servicos/[id]` | `src/app/dashboard/servicos/[id]/page.tsx` | **CRIAR** | Edição do serviço |

---

### Server Actions a criar

```
src/actions/services/
├── create-service-listing.ts
├── update-service-listing.ts
├── delete-service-listing.ts
├── get-service-by-slug.ts
├── get-paginated-services.ts   // listagem pública com paginação
├── search-services.ts          // busca por texto + categoria
├── get-services-by-profile.ts  // serviços de uma empresa específica
└── increase-service-visits.ts
```

---

### Modificações nos planos existentes

```typescript
// src/configs/plans-business.ts — adicionar em cada plano:
serviceListings: {
  quantity: 0,   // free: sem serviços ou 1 grátis
  quantity: 5,   // basic
  quantity: 20,  // pro
  quantity: -1,  // master: ilimitado
},
```

---

### Home page

```typescript
// src/app/page.tsx — adicionar seção "Serviços em Destaque"
// Similar ao RecentListings, mas para ServiceListings
import { FeaturedServices } from './_components/featured-services'
```

---

### Sitemap

```typescript
// src/app/sitemap.ts — adicionar URLs dinâmicas de /servicos/[slug]
```

---

## UX / UI — Referências

| Funcionalidade | Inspiração | Observação |
|---|---|---|
| Grid de cards | Lavou.app `/servicos` | Foto + título + preço + botão contato |
| Filtro por categoria | Lavou.app | Pills/chips horizontais |
| Busca fulltext | `/business` atual | Reutilizar `searchBusinesses` como base |
| Contato WhatsApp | `/business/[slug]` atual | Reutilizar `register-whatsapp-lead.ts` |
| Galeria de fotos | `/business/[slug]` atual | Reutilizar `BusinessGallery` |
| Rating/Avaliações | `/business/[slug]` atual | Reutilizar `submit-rating.ts` |

---

## Fluxo do Usuário

```
[Cliente]                          [Prestador]
    │                                   │
    ▼                                   ▼
/servicos                     /dashboard/servicos
    │                                   │
 busca/filtra                    cria anúncio
    │                            (título, desc,
    ▼                             preço, fotos,
/servicos/[slug]                  WhatsApp)
    │                                   │
 vê detalhes                    anúncio aparece
    │                            em /servicos
    ▼
 clica "Entrar em Contato"
    │
    ├── WhatsApp direto (wa.me/)
    └── Formulário → lead no Firestore
```

---

## Ordem de Implementação Sugerida

- [ ] **Fase 1 — Fundação**
  - [ ] Criar `/_types/service-listing.ts`
  - [ ] Criar regras Firestore para `service-listings`
  - [ ] Criar server actions básicas (CRUD)

- [ ] **Fase 2 — Dashboard**
  - [ ] `/dashboard/servicos` — listagem e gerenciamento
  - [ ] Formulário de criação/edição com upload de fotos

- [ ] **Fase 3 — Público**
  - [ ] `/servicos` — listagem pública com busca e filtros
  - [ ] `/servicos/[slug]` — página individual
  - [ ] Ativar `/business/[slug]/servicos` com dados reais

- [ ] **Fase 4 — Integração**
  - [ ] Seção "Serviços em Destaque" na home
  - [ ] Extensão dos planos com `serviceListings.quantity`
  - [ ] Atualizar sitemap

- [ ] **Fase 5 — Growth**
  - [ ] Sistema de avaliações para serviços
  - [ ] Notificações de lead por email
  - [ ] Analytics de cliques por serviço

---

## Firestore Security Rules (esboço)

```
match /service-listings/{listingId} {
  // Qualquer um pode ler listagens ativas
  allow read: if resource.data.isActive == true;

  // Apenas o dono pode criar/editar/deletar
  allow create: if request.auth != null
    && request.resource.data.userId == request.auth.uid;

  allow update, delete: if request.auth != null
    && resource.data.userId == request.auth.uid;

  // Admin pode tudo
  allow write: if isAdmin();
}
```

---

## Notas Técnicas

- **Stack:** Next.js App Router + Firestore + Cloudinary (imagens) — igual ao restante do projeto
- **Paginação:** cursor-based (igual a `get-paginated-profiles.ts`), não offset
- **Busca:** Algolia/Firestore fulltext — verificar se o projeto já usa Algolia antes de implementar `search-services.ts`
- **Slug:** gerado via `slugify(title + '-' + nanoid(6))` para garantir unicidade
- **Imagens:** seguir o padrão `save-gallery-image.ts` já existente (Cloudinary + Firestore)


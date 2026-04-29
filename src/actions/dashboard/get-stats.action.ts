'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'

// Importe o Timestamp caso utilize o Firebase Admin SDK:
// import { Timestamp } from 'firebase-admin/firestore'

const DEFAULT_STATS = {
  activeBusinesses: 0,
  announcedProperties: 0,
  totalVisits: 0,
  newLeads: 0,
}

export async function getDashboardStats() {
  try {
    const session = await getServerSession(authOptions)

    // Segurança: Retorno antecipado caso a sessão ou o ID sejam inválidos
    if (!session?.user?.id) {
      return DEFAULT_STATS
    }

    const userId = session.user.id

    // Cálculo da data limite (Últimos 30 dias) usando o objeto Date padrão
    // Nota: Se no Firestore você salva como Timestamp, envolva em Timestamp.fromDate(thirtyDaysAgo)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Executando as requisições em PARALELO usando Promise.allSettled
    // Usamos allSettled no lugar de Promise.all para que, se a query de "leads" falhar,
    // o usuário ainda consiga ver as estatísticas de imóveis e empresas.
    const [businessesResult, propertiesResult, leadsResult] =
      await Promise.allSettled([
        // 1. Empresas Ativas: Única query que precisa de .get() pois precisamos de doc.data() para somar visitas
        db
          .collection('profiles')
          .where('userId', '==', userId)
          .where('isActive', '==', true)
          .get(),

        // 2. Imóveis Anunciados: Usando agregação .count()
        // O servidor do Firestore conta os docs lá e devolve apenas 1 número inteiro. (Requer Node SDK v11.3.0+)
        db
          .collection('properties')
          .doc(userId)
          .collection('user_properties')
          .count()
          .get(),

        // 3. Novos Leads: Usando agregação .count()
        db
          .collection('leads')
          .where('ownerId', '==', userId)
          .where('createdAt', '>=', thirtyDaysAgo)
          .count()
          .get(),
      ])

    // Inicialização das variáveis com os valores padrão
    let { activeBusinesses, totalVisits, announcedProperties, newLeads } =
      DEFAULT_STATS

    // Processamento seguro dos resultados
    if (businessesResult.status === 'fulfilled') {
      activeBusinesses = businessesResult.value.size
      totalVisits = businessesResult.value.docs.reduce((acc, doc) => {
        return acc + (doc.data().totalVisits || 0)
      }, 0)
    } else {
      console.error('[Stats] Erro em Profiles:', businessesResult.reason)
    }

    if (propertiesResult.status === 'fulfilled') {
      announcedProperties = propertiesResult.value.data().count
    } else {
      console.error('[Stats] Erro em Properties:', propertiesResult.reason)
    }

    if (leadsResult.status === 'fulfilled') {
      newLeads = leadsResult.value.data().count
    } else {
      console.error('[Stats] Erro em Leads:', leadsResult.reason)
    }

    return {
      activeBusinesses,
      announcedProperties,
      totalVisits,
      newLeads,
    }
  } catch (error) {
    // Catch genérico para capturar falhas na autenticação ou rede
    // O log fica restrito ao servidor (seu terminal ou logs da Vercel)
    console.error('[getDashboardStats] Erro Crítico:', error)

    // O Frontend recebe objetos primitivos limpos, sem rastros do erro
    return DEFAULT_STATS
  }
}

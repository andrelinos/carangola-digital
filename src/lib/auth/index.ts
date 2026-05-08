import 'server-only'

import { FirestoreAdapter } from '@auth/firebase-adapter'
import { Timestamp } from 'firebase-admin/firestore'
import type { NextAuthOptions } from 'next-auth'
import type { AdapterUser } from 'next-auth/adapters'
import GoogleProvider from 'next-auth/providers/google'
import { firebaseCert } from '../firebase'
import { getGoogleCredentials } from './utils/get-google-credentials'

// 1. Instancie o adapter
const firestoreAdapter = FirestoreAdapter({
  credential: firebaseCert,
})

export const authOptions: NextAuthOptions = {
  // 2. Intercepte o adapter para injetar dados padrão na criação
  adapter: {
    ...firestoreAdapter,
    async createUser(user: Omit<AdapterUser, 'id'>) {
      if (!firestoreAdapter.createUser) {
        throw new Error('FirestoreAdapter não implementa createUser')
      }
      const customUser = {
        ...user,
        accountVerified: false,
        planActive: {
          profiles: {
            expiresAt: null,
            type: 'free',
            status: 'active',
            planDetails: { name: 'free', period: 'indeterminado', price: 0 },
          },
          properties: {
            expiresAt: null,
            type: 'free',
            status: 'active',
            planDetails: { name: 'free', period: 'indeterminado', price: 0 },
          },
        },
        createdAt: Timestamp.now().toMillis(),
        updatedAt: Timestamp.now().toMillis(),
      }
      // Delega a criação final pro FirestoreAdapter com os dados completos
      return await firestoreAdapter.createUser(customUser as any) as AdapterUser
    },
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],

  // Pode remover o block "events: { createUser }", pois o Adapter já resolve isso

  callbacks: {
    async session({ session, user }) {
      // Graças ao Module Augmentation, o TS não vai mais reclamar aqui
      if (session.user && user) {
        session.user.id = user.id
        // user.name, image e email já costumam ser injetados pela DefaultSession

        // Repassa os campos do DB para a sessão.
        // Fallback defensivo: usuários antigos sem `planActive` no Firestore
        // recebem o plano free automaticamente na sessão.
        const freePlanEntry = {
          expiresAt: null,
          type: 'free',
          status: 'active',
          planDetails: { name: 'free', period: 'indeterminado', price: 0 },
        }
        session.user.planActive = user.planActive ?? {
          profiles: freePlanEntry,
          properties: freePlanEntry,
        }

        session.user.accountVerified = user.accountVerified
        session.user.hasProfileLink = user.hasProfileLink
        session.user.role = user.role
        session.user.myProfileLink = user.myProfileLink
        session.user.favorites = user.favorites
      }

      return session
    },
  },

  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request?provider=email&type=email',
  },

  secret: process.env.NEXTAUTH_SECRET,
}

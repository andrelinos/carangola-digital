import 'server-only'

import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import { FirestoreAdapter } from '@auth/firebase-adapter'
import { Timestamp } from 'firebase-admin/firestore'
import { db, firebaseCert } from '../firebase'
import { getGoogleCredentials } from './utils/get-google-credentials'

export const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter({
    credential: firebaseCert,
  }),
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  events: {
    async createUser({ user }) {
      if (user.id) {
        await db
          .collection('users')
          .doc(user.id)
          .set({
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
          }, { merge: true }) // <--- ESSENCIAL para não apagar o nome/imagem
      }
    },
  },

  callbacks: {
    async session({ session, user }) {
      // No modo "database", o parâmetro 'user' já vem do Firestore via Adapter
      if (session.user && user) {
        session.user.id = user.id
        session.user.name = user.name
        session.user.image = user.image

        // Atribui os campos extras que o Adapter buscou automaticamente
        // (Recomendo tipar o user como 'any' ou criar um next-auth.d.ts se der erro de TS)
        const dbUser = user as any;

        session.user.planActive = dbUser.planActive
        session.user.accountVerified = dbUser.accountVerified
        session.user.hasProfileLink = dbUser.hasProfileLink
        session.user.role = dbUser.role
        session.user.myProfileLink = dbUser.myProfileLink
        session.user.favorites = dbUser.favorites
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
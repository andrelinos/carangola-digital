import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

import { FirestoreAdapter } from '@auth/firebase-adapter'

import { serverEnv } from '@/utils/env'
import { Timestamp } from 'firebase-admin/firestore'
import { db, firebaseCert } from './firebase'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: FirestoreAdapter({
    credential: firebaseCert,
  }),
  providers: [Google],
  events: {
    async createUser({ user }) {
      if (user.id) {
        await db
          .collection('users')
          .doc(user.id)
          .set({
            accountVerified: false,
            planActive: {
              expiresAt: null,
              type: 'free',
              status: 'active',
              planDetails: {
                name: 'Free',
                period: 'indeterminado',
                price: 0,
              },
            },
            createdAt: Timestamp.now().toMillis(),
            updatedAt: Timestamp.now().toMillis(),
          })
      }
    },
  },
  callbacks: {},
  secret: serverEnv.AUTH_SECRET,
})

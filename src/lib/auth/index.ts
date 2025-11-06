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
            name: user.name,
            accountVerified: false,
            planActive: {
              expiresAt: null,
              type: 'free',
              status: 'active',
              planDetails: {
                name: 'free',
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

  callbacks: {
    async session({ session, user }) {
      if (session.user && user.id) {
        const userDocRef = db.collection('users').doc(user.id)
        const userDoc = await userDocRef.get()

        if (userDoc.exists) {
          const userData = userDoc.data()

          session.user.id = userDoc.id
          session.user.planActive = userData?.planActive
          session.user.accountVerified = userData?.accountVerified
          session.user.hasProfileLink = userData?.hasProfileLink
          session.user.role = userData?.role
          session.user.myProfileLink = userData?.myProfileLink
          session.user.favorites = userData?.favorites
        }
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

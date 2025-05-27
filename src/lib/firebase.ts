import 'server-only'

import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

// Certificado Firebase
cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
})

// Instância do Firebase
export const firebaseCert = cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
})

if (!getApps().length) {
  initializeApp({
    credential: firebaseCert,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    // databaseURL: process.env.FIREBASE_DATABASE_URL,
  })
}

export const db = getFirestore()

export const storage = getStorage().bucket()

export async function getDownloadURLFromPath(path?: string) {
  if (!path) return

  try {
    const file = storage.file(path)

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '01-01-2500',
    })

    return url
  } catch (error) {
    return
  }
}

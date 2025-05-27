import { z } from 'zod'

const serverEnvSchema = z.object({
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_STORAGE_BUCKET: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string(),
  AUTH_SECRET: z.string(),
  MIXPANEL_TOKEN: z.string(),
  ANALYTICS_GOOGLE_ID: z.string(),
})

const _env = serverEnvSchema.safeParse({
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  AUTH_SECRET: process.env.AUTH_SECRET,
  MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN,
  ANALYTICS_GOOGLE_ID: process.env.ANALYTICS_GOOGLE_ID,
})

if (!_env.success) {
  console.error('Erro nas variáveis de ambiente:', _env.error.format())
  throw new Error('Variáveis de ambiente inválidas.')
}

export const serverEnv = _env.data

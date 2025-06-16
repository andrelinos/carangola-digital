import { z } from 'zod'

const serverEnvSchema = z.object({
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_STORAGE_BUCKET: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  BASE_URL: z.string(),
  FILE_JSON_SEARCH_PATH: z.string(),
  AUTH_SECRET: z.string(),
  MIXPANEL_TOKEN: z.string(),
  ANALYTICS_GOOGLE_ID: z.string(),
  MERCADO_PAGO_ACCESS_TOKEN: z.string(),
  MERCADO_PAGO_WEBHOOK_SECRET: z.string(),
  NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY: z.string(),
})

const _env = serverEnvSchema.safeParse({
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  BASE_URL: process.env.BASE_URL,
  FILE_JSON_SEARCH_PATH: process.env.FILE_JSON_SEARCH_PATH,
  AUTH_SECRET: process.env.AUTH_SECRET,
  MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN,
  ANALYTICS_GOOGLE_ID: process.env.ANALYTICS_GOOGLE_ID,
  MERCADO_PAGO_ACCESS_TOKEN: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  MERCADO_PAGO_WEBHOOK_SECRET: process.env.MERCADO_PAGO_WEBHOOK_SECRET,
  NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY:
    process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY,
})

if (!_env.success) {
  console.error('Erro nas variáveis de ambiente:', _env.error.format())
  throw new Error('Variáveis de ambiente inválidas.')
}

export const serverEnv = _env.data

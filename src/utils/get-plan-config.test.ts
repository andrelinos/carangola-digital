import { describe, expect, it } from 'vitest'
import { plansBusinessConfig } from '@/configs/plans-business'
import { getPlanConfig } from '@/utils/get-plan-config'

const FUTURE_DATE = Date.now() + 1000 * 60 * 60 * 24 * 30 // +30 dias
const PAST_DATE = Date.now() - 1000 * 60 * 60 * 24 * 10 // -10 dias

describe('getPlanConfig', () => {
  it('retorna config do plano "free" quando planActive é undefined', () => {
    const config = getPlanConfig(undefined)
    expect(config).toEqual(plansBusinessConfig.free)
  })

  it('retorna config do plano "free" quando planActive.status não é "active"', () => {
    const config = getPlanConfig({
      type: 'basic',
      status: 'inactive',
      expiresAt: FUTURE_DATE,
    })
    expect(config).toEqual(plansBusinessConfig.free)
  })

  it('retorna config do plano "free" quando o plano está expirado', () => {
    const config = getPlanConfig({
      type: 'basic',
      status: 'active',
      expiresAt: PAST_DATE,
    })
    expect(config).toEqual(plansBusinessConfig.free)
  })

  it('retorna config do plano "free" quando expiresAt é null', () => {
    const config = getPlanConfig({
      type: 'basic',
      status: 'active',
      expiresAt: null,
    })
    expect(config).toEqual(plansBusinessConfig.free)
  })

  it('retorna config correta para plano "basic" ativo', () => {
    const config = getPlanConfig({
      type: 'basic',
      status: 'active',
      expiresAt: FUTURE_DATE,
    })
    expect(config).toEqual(plansBusinessConfig.basic)
    expect(config.imageGallery.enabled).toBe(true)
  })

  it('retorna config correta para plano "pro" ativo', () => {
    const config = getPlanConfig({
      type: 'pro',
      status: 'active',
      expiresAt: FUTURE_DATE,
    })
    expect(config).toEqual(plansBusinessConfig.pro)
    expect(config.premiumFeatures.stickyCta).toBe(true)
  })

  it('retorna config correta para plano "master" ativo', () => {
    const config = getPlanConfig({
      type: 'master',
      status: 'active',
      expiresAt: FUTURE_DATE,
    })
    expect(config).toEqual(plansBusinessConfig.master)
    expect(config.imageGallery.limit).toBe(20)
  })

  it('retorna config "free" para tipo de plano desconhecido', () => {
    const config = getPlanConfig({
      type: 'unknown_plan' as any,
      status: 'active',
      expiresAt: FUTURE_DATE,
    })
    expect(config).toEqual(plansBusinessConfig.free)
  })
})

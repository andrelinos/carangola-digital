import { describe, expect, it, vi, beforeEach } from 'vitest'
import { getPlanStatus } from '@/utils/get-plan-status'

const FUTURE_MS = Date.now() + 1000 * 60 * 60 * 24 * 30 // +30 dias
const PAST_MS = Date.now() - 1000 * 60 * 60 * 24 * 10  // -10 dias

const BASE_USER = {
  hasProfileLink: true,
  role: undefined as string | undefined,
  myProfileLink: 'minha-empresa',
  accountVerified: true,
  favorites: [],
}

describe('getPlanStatus', () => {
  describe('usuário sem plano (free)', () => {
    it('retorna planType "free" quando não há planActive', () => {
      const result = getPlanStatus({ ...BASE_USER })
      expect(result.planType).toBe('free')
    })

    it('retorna status false quando não há planActive', () => {
      const result = getPlanStatus({ ...BASE_USER })
      expect(result.status).toBe(false)
    })

    it('retorna expiresIn "N/A" quando não há planActive', () => {
      const result = getPlanStatus({ ...BASE_USER })
      expect(result.expiresIn).toBe('N/A')
    })

    it('retorna transactionAmount 0 quando não há planActive', () => {
      const result = getPlanStatus({ ...BASE_USER })
      expect(result.transactionAmount).toBe(0)
    })

    it('retorna currency "BRL" por padrão', () => {
      const result = getPlanStatus({ ...BASE_USER })
      expect(result.currency).toBe('BRL')
    })
  })

  describe('usuário com plano ativo e válido', () => {
    const activePlan = {
      id: 1,
      type: 'basic',
      expiresAt: FUTURE_MS,
      transactionAmount: 2990,
      currency: 'BRL',
    }

    it('retorna planType "basic" para plano basic ativo', () => {
      const result = getPlanStatus({ ...BASE_USER, planActive: activePlan })
      expect(result.planType).toBe('basic')
    })

    it('retorna status true para plano válido', () => {
      const result = getPlanStatus({ ...BASE_USER, planActive: activePlan })
      expect(result.status).toBe(true)
    })

    it('retorna transactionAmount correto', () => {
      const result = getPlanStatus({ ...BASE_USER, planActive: activePlan })
      expect(result.transactionAmount).toBe(2990)
    })

    it('retorna expiresIn formatado em dias ("em X dias")', () => {
      const result = getPlanStatus({ ...BASE_USER, planActive: activePlan })
      expect(result.expiresIn).toMatch(/dia/)
    })
  })

  describe('usuário com plano expirado', () => {
    const expiredPlan = {
      id: 2,
      type: 'pro',
      expiresAt: PAST_MS,
      transactionAmount: 5990,
      currency: 'BRL',
    }

    it('retorna status false para plano expirado', () => {
      const result = getPlanStatus({ ...BASE_USER, planActive: expiredPlan })
      expect(result.status).toBe(false)
    })

    it('retorna planType "pro" mesmo expirado (o tipo ainda é registrado)', () => {
      const result = getPlanStatus({ ...BASE_USER, planActive: expiredPlan })
      expect(result.planType).toBe('pro')
    })

    it('retorna expiresIn "Expirado" para plano vencido', () => {
      const result = getPlanStatus({ ...BASE_USER, planActive: expiredPlan })
      expect(result.expiresIn).toBe('Expirado')
    })
  })

  describe('propagação de metadados do usuário', () => {
    it('retorna hasProfileLink correto', () => {
      const result = getPlanStatus({ ...BASE_USER, hasProfileLink: false })
      expect(result.hasProfileLink).toBe(false)
    })

    it('retorna myProfileLink correto', () => {
      const result = getPlanStatus({ ...BASE_USER, myProfileLink: 'padaria-xyz' })
      expect(result.myProfileLink).toBe('padaria-xyz')
    })

    it('retorna role do usuário', () => {
      const result = getPlanStatus({ ...BASE_USER, role: 'admin' })
      expect(result.role).toBe('admin')
    })
  })
})

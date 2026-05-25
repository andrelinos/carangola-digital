import { LRUCache } from 'lru-cache'

type RateLimitOptions = {
  uniqueTokenPerInterval?: number
  interval?: number
}

/**
 * Cria um limitador de taxa em memória básico.
 * Como o Vercel Edge Serverless não mantém estado persistente prolongado entre chamadas,
 * este rate limiter funciona melhor para picos de rajadas (bursts) em instâncias ativas,
 * mitigando ataques curtos de força bruta, mesmo que resetado em cold starts.
 */
export function rateLimit(options?: RateLimitOptions) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount)
        }
        tokenCount[0] += 1

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit

        // Adicionamos os headers tradicionais de rate limit
        const headers = {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': isRateLimited
            ? '0'
            : (limit - currentUsage).toString(),
        }

        if (isRateLimited) {
          reject(new Error('Rate limit exceeded', { cause: headers }))
        } else {
          resolve()
        }
      }),
  }
}

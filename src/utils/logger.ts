/**
 * Utilitário de log seguro para o projeto.
 *
 * Silencia os logs em produção para evitar vazamento de dados
 * e melhora a experiência de depuração em desenvolvimento.
 */

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args)
    }
  },
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args)
    }
  },
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args)
    }
  },
  error: (...args: any[]) => {
    // Erros podem ser registrados mesmo em produção,
    // mas de forma segura (sem stack traces verbosos se possível)
    if (isDev) {
      console.error(...args)
    } else {
      // Aqui você poderia integrar com Sentry ou outro serviço
      // console.error('Erro em produção: ', args[0])
    }
  },
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args)
    }
  },
}

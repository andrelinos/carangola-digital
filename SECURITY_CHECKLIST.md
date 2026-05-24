# 🛡️ Relatório de Análise de Segurança (Carangola Digital)

Este documento lista as vulnerabilidades ou falhas de boas práticas de segurança encontradas no projeto.
Use as caixas de seleção (`[ ]`) para ir marcando conforme realizar as correções.

## 🚨 Risco Crítico
- [x] **Configuração Insegura no Next.js Image Optimization (`next.config.ts`)**
  - **Problema:** A propriedade `remotePatterns` está configurada com `hostname: '*'`.
  - **Risco:** Vulnerabilidade a **SSRF** (Server-Side Request Forgery) e **Custo Abusivo**. Qualquer pessoa pode usar o otimizador de imagens do seu servidor Next.js como proxy para baixar imagens gigantescas de qualquer site da internet, consumindo toda a sua cota e banda de hospedagem.
  - **Solução:** Substitua o `*` pelos domínios que você realmente utiliza (ex: `res.cloudinary.com`, `firebasestorage.googleapis.com`, `lh3.googleusercontent.com`).

## ⚠️ Risco Médio / Alto
- [x] **Vulnerabilidade XSS em JSON-LD (`src/components/seo/*.tsx`)**
  - **Problema:** O código utiliza `dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}`.
  - **Risco:** A função nativa `JSON.stringify` **não escapa** os caracteres `<` e `/`. Se um usuário mal intencionado colocar `</script><script>alert('Hacked')</script>` no nome da empresa dele, isso quebrará o bloco de script no `<head>` e executará código no navegador dos visitantes.
  - **Solução:** Trocar o `JSON.stringify` padrão por uma sanitização segura ou replace (`JSON.stringify(jsonLd).replace(/</g, '\\u003c')`).

- [x] **Regras do Firestore Ausentes no Repositório (Local)**
  - **Problema:** Arquivos vitais de regras (`firestore.rules` / `firebase.json`) não foram detectados no código-fonte local.
  - **Risco:** Se as regras estão sendo editadas apenas pelo Console do Firebase e não estão versionadas no Git, fica impossível auditar a segurança. Pior ainda: caso o banco de dados esteja em "Modo de Teste", qualquer pessoa que descobrir seu ID do Firebase pode deletar todo o banco.
  - **Solução:** Puxar as regras atuais, salvar num arquivo `firestore.rules`, configurar os matchers com `request.auth.uid` e criar rotinas na CI para deploy.

## 🟡 Boas Práticas / Risco Moderado
- [x] **Ausência de Cabeçalhos de Segurança HTTP (Security Headers)**
  - **Problema:** O arquivo `next.config.ts` não injeta nenhum header de proteção.
  - **Risco:** O site fica suscetível a ataques de **Clickjacking** (onde colocam seu site dentro de um iframe malicioso) e **MIME-Sniffing**.
  - **Solução:** Adicionar a função `headers()` no `next.config.ts` com políticas como `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, e um `Content-Security-Policy` (CSP) básico.

- [x] **Falta de Rate Limiting (Limitação de Requisições)**
  - **Problema:** Nenhuma barreira contra múltiplas chamadas seguidas em Actions ou Autenticação.
  - **Risco:** Exposição a força bruta (ataques tentando derrubar a API de buscas ou lotar o banco de dados disparando milhares de cadastros num robô).
  - **Solução:** Implementar uma trava usando um pacote de Rate Limit (como `@upstash/ratelimit` acoplado ao Redis, ou bloqueios de tempo em memória para IPs).

---
*Dica de fluxo: Ao concluir uma tarefa, mude o `[ ]` para `[x]`. Essa lista foi salva na raiz como `SECURITY_CHECKLIST.md` para facilitar o acompanhamento!*

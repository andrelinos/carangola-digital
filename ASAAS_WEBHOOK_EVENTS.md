# Configuração de Webhooks do Asaas

Para o correto funcionamento do sistema de assinaturas e integrações da Carangola Digital, você precisa marcar **obrigatoriamente** os eventos abaixo no painel do Asaas quando for configurar o webhook de Produção.

> **Caminho no Asaas:** Configurações da Conta > Integrações > Webhooks

---

## 🟢 Eventos de Pagamentos / Cobranças

Marque estas opções na aba de pagamentos para garantir que a ativação, atrasos e estornos funcionem corretamente:

- [x] **Pagamento confirmado** (`PAYMENT_CONFIRMED` / `PAYMENT_RECEIVED`)
- [x] **Pagamento atrasado** (`PAYMENT_OVERDUE`)
- [x] **Pagamento estornado** (`PAYMENT_REFUNDED`)
- [x] **Pagamento removido** (`PAYMENT_DELETED`)
- [x] **Pagamento em disputa / Contestação de Chargeback** (`PAYMENT_CHARGEBACK_REQUESTED` / `PAYMENT_CHARGEBACK_DISPUTE`)
- [x] **Reprovado pela análise de risco** (`PAYMENT_REPROVED_BY_RISK_ANALYSIS`)

---

## 🔵 Eventos de Assinaturas (Recorrência)

Marque estas opções para garantir que o fluxo estilo Netflix, upgrades e cancelamentos funcionem corretamente:

- [x] **Assinatura ativada** (`SUBSCRIPTION_ACTIVATED`)
- [x] **Assinatura cancelada** (`SUBSCRIPTION_DELETED`)
- [x] **Assinatura inativada** (`SUBSCRIPTION_INACTIVATED`)

*(Nota: O Asaas envia os eventos `SUBSCRIPTION_PAYMENT_*` equivalentes aos eventos de cobrança listados acima quando ocorrem dentro de uma assinatura. Marcando os eventos de pagamentos + os eventos diretos de assinaturas acima, nosso sistema interceptará todos corretamente).*

---

### Por que esses eventos importam?
- **PAYMENT_CONFIRMED**: Libera o acesso Premium/Pro do cliente e processa Upgrades.
- **CHARGEBACK / REFUNDED / REPROVED**: Inativa imediatamente o plano do cliente para prevenir acesso gratuito.
- **SUBSCRIPTION_DELETED / INACTIVATED**: Avisa o nosso sistema que a renovação foi cancelada (se o plano ainda não expirou, o cliente mantém acesso até o fim do período - Regra Netflix).

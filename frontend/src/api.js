// Todas as chamadas para a API Spring Boot ficam aqui.
const BASE = '/api/tarefas'

async function requisicao(url, opcoes = {}) {
  const resposta = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  })
  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} ao falar com a API`)
  }
  return resposta.status === 204 ? null : resposta.json()
}

export const listarTarefas = () => requisicao(BASE)

export const criarTarefa = (tarefa) =>
  requisicao(BASE, { method: 'POST', body: JSON.stringify(tarefa) })

export const atualizarTarefa = (id, tarefa) =>
  requisicao(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(tarefa) })

export const excluirTarefa = (id) =>
  requisicao(`${BASE}/${id}`, { method: 'DELETE' })

import { useEffect, useState } from 'react'
import { listarTarefas, criarTarefa, atualizarTarefa, excluirTarefa } from './api'

export default function App() {
  const [tarefas, setTarefas] = useState([])
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  async function carregar() {
    try {
      setErro('')
      setTarefas(await listarTarefas())
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregar() }, [])

  function limparFormulario() {
    setTitulo('')
    setDescricao('')
    setEditandoId(null)
  }

  async function salvar(evento) {
    evento.preventDefault()
    if (!titulo.trim()) return
    try {
      if (editandoId) {
        const atual = tarefas.find((t) => t.id === editandoId)
        await atualizarTarefa(editandoId, { titulo, descricao, concluida: atual.concluida })
      } else {
        await criarTarefa({ titulo, descricao })
      }
      limparFormulario()
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function alternarConcluida(tarefa) {
    try {
      await atualizarTarefa(tarefa.id, { ...tarefa, concluida: !tarefa.concluida })
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function remover(id) {
    if (!confirm('Excluir esta tarefa?')) return
    try {
      await excluirTarefa(id)
      if (editandoId === id) limparFormulario()
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  function editar(tarefa) {
    setEditandoId(tarefa.id)
    setTitulo(tarefa.titulo)
    setDescricao(tarefa.descricao ?? '')
  }

  const pendentes = tarefas.filter((t) => !t.concluida).length

  return (
    <main className="container">
      <h1>Lista de Tarefas</h1>
      <p className="resumo">
        {tarefas.length} tarefa(s) · {pendentes} pendente(s)
      </p>

      <form onSubmit={salvar} className="formulario">
        <input
          placeholder="O que precisa ser feito?"
          value={titulo}
          maxLength={120}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição (opcional)"
          value={descricao}
          maxLength={500}
          rows={2}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <div className="acoes-form">
          <button type="submit">{editandoId ? 'Salvar alterações' : 'Adicionar'}</button>
          {editandoId && (
            <button type="button" className="secundario" onClick={limparFormulario}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {erro && <p className="erro">{erro}</p>}
      {carregando && <p>Carregando…</p>}
      {!carregando && tarefas.length === 0 && !erro && (
        <p className="vazio">Nenhuma tarefa ainda. Adicione a primeira!</p>
      )}

      <ul className="lista">
        {tarefas.map((t) => (
          <li key={t.id} className={t.concluida ? 'concluida' : ''}>
            <input
              type="checkbox"
              checked={t.concluida}
              onChange={() => alternarConcluida(t)}
              aria-label="Marcar como concluída"
            />
            <div className="texto">
              <strong>{t.titulo}</strong>
              {t.descricao && <span>{t.descricao}</span>}
            </div>
            <button className="secundario" onClick={() => editar(t)}>Editar</button>
            <button className="perigo" onClick={() => remover(t.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </main>
  )
}

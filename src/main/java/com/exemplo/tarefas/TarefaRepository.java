package com.exemplo.tarefas;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {

    // O Spring cria a consulta a partir do nome do método:
    // pendentes primeiro, e as mais novas no topo.
    List<Tarefa> findAllByOrderByConcluidaAscCriadaEmDesc();
}

# Lista de Tarefas: Spring Boot + React

API REST em Java 21 / Spring Boot com front em React. Os dois sobem juntos
no mesmo servidor: o build do React vai para `src/main/resources/static`.

## Endpoints

| Método | Rota                | O que faz |
|--------|---------------------|-----------|
| GET    | `/api/tarefas`      | Lista todas (pendentes primeiro) |
| GET    | `/api/tarefas/{id}` | Busca uma |
| POST   | `/api/tarefas`      | Cria |
| PUT    | `/api/tarefas/{id}` | Atualiza |
| DELETE | `/api/tarefas/{id}` | Exclui |

Exemplo de corpo (POST/PUT):
```json
{ "titulo": "Estudar Spring", "descricao": "Capítulo de JPA", "concluida": false }
```

## Pré-requisitos no seu PC
- Java 21 (JDK)
- Maven 3.9+ (ou use o Maven embutido do IntelliJ)
- Node.js 20+ (só para o front)

## Rodar no seu PC (banco H2 em memória, sem configurar nada)

**Jeito 1: tudo junto, numa porta só**
```bash
cd frontend
npm install
npm run build        # gera o front dentro de src/main/resources/static
cd ..
mvn spring-boot:run
```
Acesse http://localhost:8080

**Jeito 2: modo desenvolvimento (o front recarrega sozinho quando você edita)**
```bash
# Terminal 1
mvn spring-boot:run

# Terminal 2
cd frontend
npm install
npm run dev
```
Acesse http://localhost:5173 (as chamadas `/api` são repassadas para a porta 8080).

## Rodar no seu PC usando o banco do Neon
Defina as variáveis de ambiente e ative o perfil `prod`:
```bash
export SPRING_PROFILES_ACTIVE=prod
export DB_URL="jdbc:postgresql://SEU-HOST.neon.tech/neondb?sslmode=require"
export DB_USER="neondb_owner"
export DB_PASSWORD="sua-senha"
mvn spring-boot:run
```
(No Windows/PowerShell use `$env:DB_URL="..."` em vez de `export`.)

## Deploy no Render
1. Suba este projeto para um repositório no GitHub.
2. No Render: **New → Web Service**, depois conecte o repositório.
3. Em Language/Runtime, escolha **Docker**. Deixe os comandos de build e start em branco.
4. Instância: **Free**.
5. Em **Environment Variables**:
   - `SPRING_PROFILES_ACTIVE` = `prod`
   - `DB_URL` = `jdbc:postgresql://SEU-HOST.neon.tech/neondb?sslmode=require`
   - `DB_USER` = usuário do Neon
   - `DB_PASSWORD` = senha do Neon
6. Clique em **Deploy**. O primeiro build demora alguns minutos.

O Dockerfile faz tudo: compila o React, empacota o Spring Boot e gera uma
imagem pequena só com o Java.

## Estrutura
```
├── pom.xml
├── Dockerfile
├── src/main/java/com/exemplo/tarefas/
│   ├── TarefasApplication.java   → classe principal
│   ├── Tarefa.java               → entidade (tabela "tarefa")
│   ├── TarefaRepository.java     → acesso ao banco
│   └── TarefaController.java     → endpoints REST
├── src/main/resources/
│   ├── application.properties       → PC (H2)
│   └── application-prod.properties  → produção (PostgreSQL)
└── frontend/                         → React + Vite
    └── src/ (App.jsx, api.js, App.css)
```

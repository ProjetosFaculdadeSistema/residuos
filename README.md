<div align="center">

# ♻️ Sistema de Gerenciamento de Resíduos Sólidos

Aplicação web full-stack para gerenciamento da coleta de resíduos sólidos urbanos.

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Upload-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

> Projeto Integrador — PSA I · IFPR · Bacharelado em Sistemas de Informação

</div>

---

## Sobre o Projeto

Aplicação web completa (full-stack) para gerenciamento da coleta de resíduos sólidos urbanos. Permite cadastrar resíduos, motoristas, veículos e rotas com pontos GPS interativos no mapa, além de registrar e acompanhar operações de coleta com visualização em timeline.

> Arquitetura MVC no backend (controllers → services → repositories → models) com API REST consumida pelo frontend React.

---

## Tecnologias Utilizadas

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| Java | 21 | Linguagem principal |
| Spring Boot | 4.0.3 | Framework principal |
| Spring Web MVC | — | Controllers REST |
| Spring Security + JWT | — | Autenticação com token |
| Spring Data JPA / Hibernate | — | Persistência de dados |
| MapStruct | 1.5.5 | Mapeamento Entity ↔ DTO |
| Lombok | — | Redução de boilerplate |
| PostgreSQL | 17 | Banco de dados relacional |
| Maven | — | Gerenciador de dependências |
| JUnit 5 | — | Testes unitários (37 testes) |
| Cloudinary | 1.36.0 | Armazenamento de imagens na nuvem |

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18 | Biblioteca de UI |
| Vite | — | Bundler e dev server |
| React Router DOM | 6 (Data API) | Roteamento com `createBrowserRouter` |
| Redux Toolkit | — | Estado global de autenticação |
| React Hook Form | — | Formulários com validação |
| Axios | — | Requisições HTTP para a API |
| Tailwind CSS | — | Estilização utilitária |
| DaisyUI | — | Componentes UI (tema eco personalizado) |
| Leaflet.js | 1.9.4 | Mapa interativo (via `<iframe>`) |
| OSRM API | pública | Roteamento por ruas reais |

---

## Funcionalidades

- **Autenticação** — Login com JWT, rotas protegidas, logout
- **Dashboard** — Cards de resumo + gráfico de barras SVG (coletas por mês)
- **Resíduos** — CRUD completo com imagem (upload Cloudinary), tipo, periculosidade, quantidade e unidade
- **Motoristas** — CRUD com CNH, categoria, telefone, status (Ativo/Inativo/Afastado) e foto de perfil
- **Veículos** — CRUD com placa, modelo, tipo, capacidade, ano e foto
- **Rotas** — CRUD com pontos GPS clicáveis no mapa, nomes editáveis por ponto e cálculo automático de distância via OSRM
- **Mapa de Rotas** — Visualização de qualquer rota com trajeto pelas ruas via OSRM e painel de distância
- **Coletas** — CRUD com timeline por mês, exportação CSV e impressão/PDF
- **Busca em tempo real** — Filtro por texto em todas as listagens
- **Paginação** — 10 itens por página em todas as listas
- **Toasts** — Notificações de sucesso/erro no canto da tela
- **Modal de confirmação** — Substitui o `confirm()` nativo do browser
- **Página 404** — Tela amigável para rotas inexistentes

---

## Decisões Técnicas Relevantes

**Isolamento do Leaflet via `<iframe>`**
O Leaflet é incompatível com o comportamento de dupla montagem do React 18. A solução adotada foi carregar o mapa em páginas HTML estáticas (`/public/mapa.html` e `/public/mapa-editor.html`) dentro de `<iframe>`, com comunicação bidirecional via `window.postMessage`. Isso elimina qualquer interferência do ciclo de vida do React. O cálculo de distância da rota é feito via OSRM e o resultado é enviado ao formulário React via `postMessage`, preenchendo o campo automaticamente.

**Upload de imagens via Cloudinary**
Motoristas, veículos e resíduos suportam upload de foto. O frontend envia `multipart/form-data` com os dados e a imagem em campos separados (`dados` + `foto`). O backend processa via `@RequestPart`, faz upload para o Cloudinary e salva a URL no banco. Para que o browser adicione o `boundary` automaticamente, o `Content-Type` do axios é definido como `null` em vez de `multipart/form-data`.

**Pattern DTO + MapStruct**
Toda comunicação entre frontend e backend usa DTOs (Data Transfer Objects) mapeados via MapStruct, evitando expor entidades JPA diretamente. Os mappers ignoram campos sem correspondência com `unmappedTargetPolicy = ReportingPolicy.IGNORE`.

**Coleta como registro histórico**
`Motorista`, `Residuo`, `Veiculo` e `Rota` usam `CascadeType.PERSIST/MERGE` sem `orphanRemoval` em `Coleta`. Isso garante que o histórico de coletas não seja apagado ao excluir cadastros auxiliares.

**Gráfico e paginação sem bibliotecas externas**
O gráfico de barras do dashboard é SVG puro. O componente de paginação também é próprio. Nenhuma biblioteca de gráficos ou paginação foi adicionada ao projeto.

---

## Estrutura do Projeto

```
residuos-main/
├── src/main/java/br/edu/ifpr/bsi/residuos/   ← Backend
│   ├── config/           SecurityConfig, JwtFilter, CORS
│   ├── controllers/      REST Controllers (5 entidades + auth)
│   ├── dto/              Request/Response DTOs
│   ├── mapper/           MapStruct mappers
│   ├── model/            Entidades JPA
│   ├── repositories/     Spring Data JPA repositories
│   └── services/         Regras de negócio
│
└── frontend/src/                              ← Frontend
    ├── components/       Sidebar, Toast, ConfirmModal, Paginacao, ProtectedRoute
    ├── hooks/            useApiRequest (loading/error state)
    ├── pages/
    │   ├── Home.jsx      Dashboard com gráfico
    │   ├── NotFound.jsx  Página 404
    │   ├── coletas/      ListaColetas (timeline) + FormColeta
    │   ├── motoristas/   Lista + Form
    │   ├── residuos/     Lista + Form + Detalhes
    │   ├── rotas/        Lista + Form (com mapa editor) + MapaRotas
    │   └── veiculos/     Lista + Form
    ├── public/
    │   ├── mapa.html         Leaflet isolado — visualização de rota
    │   └── mapa-editor.html  Leaflet isolado — editor de pontos GPS
    ├── services/         Axios services por entidade
    ├── store/            Redux (auth slice)
    └── routes.jsx        createBrowserRouter
```

---

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/auth/login` | Autenticação, retorna JWT |
| GET/POST | `/residuos` | Listar / Cadastrar |
| GET/PUT/DELETE | `/residuos/{codigo}` | Buscar / Atualizar / Remover |
| GET/POST | `/coletas` | Listar / Cadastrar |
| GET/PUT/DELETE | `/coletas/{codigo}` | Buscar / Atualizar / Remover |
| GET/POST | `/motoristas` | Listar / Cadastrar |
| GET/PUT/DELETE | `/motoristas/{codigo}` | Buscar / Atualizar / Remover |
| GET/POST | `/veiculos` | Listar / Cadastrar |
| GET/PUT/DELETE | `/veiculos/{codigo}` | Buscar / Atualizar / Remover |
| GET/POST | `/rotas` | Listar / Cadastrar |
| GET/PUT/DELETE | `/rotas/{codigo}` | Buscar / Atualizar / Remover |

---

## Como Executar

### Pré-requisitos
- Java 21, Maven, Node.js 20+, PostgreSQL 17

### Banco de dados
```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'admin';"
sudo -u postgres psql -c "CREATE DATABASE residuos;"
```

### Backend
```bash
# Na raiz do projeto
./mvnw spring-boot:run
# API disponível em http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App disponível em http://localhost:5173
```

### Testes
```bash
./mvnw test
# 37 testes unitários: repositórios, inserção, listagem, atualização, remoção
```

---

## Ambiente de Desenvolvimento

- **Virtualizador:** VMware Workstation Pro
- **Sistema Operacional:** Debian 13 (Trixie)
- **Banco de Dados:** PostgreSQL 17 local
- **Java:** OpenJDK 21
- **Node.js:** v20.x

---

## Autores

- João Vítor Koch
- Luiz Ricardo Zimmermann

## Instituição

Instituto Federal do Paraná — IFPR  
Bacharelado em Sistemas de Informação  
Disciplina: Programação de Software e Aplicativos I (PSA I)  
Professor: Eduardo Luiz Alba

## Backend Rick and Morty – ZRP Challenge

API backend em Node.js/TypeScript para consulta de episódios e personagens de Rick and Morty, com:

- **Arquitetura em camadas** (Controller → Service → Repository → API externa)
- **Documentação automática** via **TSOA + Swagger UI**
- **Paginação e filtros** avançados (episódios e personagens)
- **Cache distribuído** com **Redis**
- **Testes unitários e de integração** com Jest + Supertest
- **CI/CD no GitHub Actions** e **infraestrutura como código** com Bicep no Azure (App Service + Azure Cache for Redis + Key Vault)

---

## Sumário

- [Stack e decisões principais](#stack-e-decisões-principais)
- [Arquitetura da aplicação](#arquitetura-da-aplicação)
  - [Fluxo geral](#fluxo-geral)
  - [Camadas](#camadas)
- [Domínio e DTOs](#domínio-e-dtos)
- [Endpoints](#endpoints)
  - [`GET /health`](#get-health)
  - [`GET /episodes`](#get-episodes)
  - [`GET /episodes/{id}`](#get-episodesid)
  - [`GET /episodes/{id}/characters`](#get-episodesidcharacters)
- [Paginação e filtros](#paginação-e-filtros)
  - [Paginação de episódios](#paginação-de-episódios)
  - [Filtros e ordenação de personagens](#filtros-e-ordenação-de-personagens)
- [Documentação Swagger / OpenAPI](#documentação-swagger--openapi)
- [Cache com Redis](#cache-com-redis)
- [Testes](#testes)
  - [Unitários](#unitários)
  - [Integração](#integração)
  - [Decisões sobre Redis em testes](#decisões-sobre-redis-em-testes)
- [Execução local](#execução-local)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Rodando em desenvolvimento](#rodando-em-desenvolvimento)
  - [Rodando testes](#rodando-testes)
- [CI/CD do backend (GitHub Actions)](#cicd-do-backend-github-actions)
- [Infraestrutura como código (Bicep + Azure)](#infraestrutura-como-código-bicep--azure)
  - [Recursos criados](#recursos-criados)
  - [Decisões de infraestrutura](#decisões-de-infraestrutura)
- [Melhorias e funcionalidades futuras](#melhorias-e-funcionalidades-futuras)

---

## Stack e decisões principais

- **Node.js 20 + TypeScript**: tipagem forte, suporte moderno a async/await e decorators.
- **Express 5**: framework minimalista e amplamente conhecido, ideal para uma API HTTP simples.
- **TSOA**:
  - Decisão: usar **code-first** (decorators + tipos TypeScript) para gerar automaticamente:
    - Rotas Express (`RegisterRoutes`)
    - Especificação OpenAPI (`swagger.json`)
  - Justificativa: evita duplicação de documentação (comentários Swagger por rota) e mantém **fonte única da verdade** nos DTOs e controllers.
- **Axios**: cliente HTTP para consumir a API pública de Rick and Morty.
- **Azure Cache for Redis**:
  - Cacheia respostas de episódios e personagens, diminuindo latência e chamadas à API externa.
  - Connection string armazenada em **Key Vault** e exposta via **App Settings**.
- **Jest + Supertest**:
  - Testes de integração (chamando a API em memória via Supertest).
- **GitHub Actions**:
  - Pipeline de CI/CD com:
    - `npm install`
    - `npm run tsoa:gen`
    - `npm test`
    - `npm run build`
    - Deploy para Azure App Service.
- **Bicep (IaC)**:
  - Provisiona App Service (backend), Azure Cache for Redis e Key Vault.
  - Justificativa: reproduzibilidade, rastreabilidade e facilidade de recriar ambientes.

---

## Arquitetura da aplicação

### Fluxo geral

1. O cliente (frontend ou outra aplicação) chama um endpoint HTTP (`/episodes`, `/episodes/{id}`, etc.).
2. O **controller TSOA** recebe a request, valida/transforma parâmetros (via decorators) e chama o **service**.
3. O **service** contém a regra de negócio:
   - Orquestra repositórios de episódios e personagens.
   - Aplica filtros, ordenação e paginação.
4. Os **repositories** acessam a API pública de Rick and Morty via Axios, com cache em Redis.
5. O service retorna DTOs tipados, que o TSOA converte em resposta HTTP JSON.

### Camadas

- **Controller (`src/controllers/episode.controller.ts`)**
  - Papel: “face HTTP” da aplicação.
  - Responsável por:
    - Definir rotas e verbos HTTP via decorators TSOA:
      - `@Route("episodes")`
      - `@Get("/")`, `@Get("/{id}")`, `@Get("/{id}/characters")`
    - Declarar parâmetros de query e path:
      - `@Query() page?: number`, `@Query() status?: "alive" | "dead" | "unknown"`, etc.
    - Encaminhar a chamada para o service correspondente.
  - Decisão: usar TSOA como “controller HTTP” ao invés de rotas manuais do Express.
    - Justificativa: geração automática de documentação, validação e tipagem forte fim-a-fim.

- **Service (`src/services/episode.servie.ts`)**
  - Contém a **regra de negócio** do domínio de episódios:
    - Lista episódios com paginação (respeitando o formato `info + results` da API externa).
    - Busca episódio por ID.
    - Busca personagens de um episódio, aplicando:
      - filtros (nome, status, species, type, gender)
      - ordenação alfabética por nome
  - Orquestra chamadas a:
    - `IEpisodeRepository`
    - `ICharacterRepository`
  - Decisão: deixar o service “fino” e com pouca responsabilidade de infra (sem `Request`, `Response`, `Redis`, etc.).
    - Justificativa: facilita teste unitário e evita acoplamento com framework/infra.

- **Repositories (`src/repositories/**/*`)**
  - **`EpisodeRepository`**:
    - `list(params: EpisodeListAllRequestDTO): Promise<EpisodesResponseDTO>`
    - `getById(id: number): Promise<Episode>`
    - Usa Axios (`src/lib/api.ts`) e aplica cache Redis.
  - **`CharacterRepository`**:
    - `listCharactersByIds(ids: string[]): Promise<Character[]>`
    - Também cacheia resultados no Redis.
  - Decisão: encapsular acesso à API externa em repositórios.
    - Justificativa: se a fonte de dados mudar (banco, outro serviço), a camada de service permanece quase intocada.

- **Utils (`src/utils/charactersFilters.ts`)**
  - `filterCharacters`:
    - Aplica filtros por `name`, `status`, `species`, `type`, `gender` em memória.
    - Comparações case-insensitive para evitar problemas com `"Alive"` vs `"alive"`.
  - `sortCharactersByName`:
    - Ordena personagens alfabeticamente pelo `name`.
  - Decisão: extrair filtragem/ordenação para utils puros.
    - Justificativa: deixa o service mais legível e facilita testes unitários isolados de regra de filtragem.

---

## Endpoints

Abaixo estão apenas **resumos de alto nível**.  
**Toda a documentação detalhada de parâmetros, corpos de requisição e respostas está disponível no Swagger em `/docs`.**

### `GET /health`

- Verifica se a API está saudável; retorna um JSON simples com o status.

---

### `GET /episodes`

- Lista episódios com paginação e filtros compatíveis com a API Rick and Morty.
- Estrutura de resposta segue o padrão `info + results` da API original (veja `/docs` para detalhes).

---

### `GET /episodes/{id}`

- Busca um episódio específico por ID.
- Erros e schema de resposta documentados em `/docs`.

---

### `GET /episodes/{id}/characters`

- Retorna os personagens de um episódio, com suporte a filtros, ordenação por nome e paginação em memória.
- Parâmetros de filtro, paginação e schemas de resposta estão documentados no Swagger em `/docs`.

---

## Paginação e filtros

### Paginação de episódios

- A API Rick and Morty já retorna a estrutura:
  - `info.count` – total de episódios.
  - `info.pages` – número de páginas.
  - `info.next` / `info.prev` – URLs para navegação.
- O backend apenas repassa essa estrutura, permitindo ao frontend seguir a paginação nativa.

### Filtros e ordenação de personagens

No `EpisodeService.getCharactersByEpisodeId`:

1. Carrega o episódio e valida existência.
2. Extrai IDs dos personagens a partir das URLs (`.../character/{id}`).
3. Busca todos os personagens no `CharacterRepository` (com cache).
4. Aplica filtros via `filterCharacters`:
   - `name` / `species` / `type`: `.toLowerCase().includes(...)`.
   - `status` / `gender`: comparação exata, mas case-insensitive (`toLowerCase()`).
5. Ordena com `sortCharactersByName`:
   - `characters.sort((a, b) => a.name.localeCompare(b.name))`.
6. Faz paginação em memória (`page` + `pageSize` fixo).

Decisão: filtrar/ordenar em memória.
- Justificativa:
  - Número de personagens por episódio é relativamente pequeno.
  - Simples de evoluir (podemos trocar por consultas server-side no futuro, se necessário).

---

## Documentação Swagger / OpenAPI

- Gerada automaticamente com **TSOA** a partir dos controllers e DTOs.
- Arquivos gerados:
  - `src/routes/routes.ts` – rotas Express.
  - `src/docs/swagger.json` – especificação OpenAPI 3.
- Servida em:
  - **`GET /docs`** via `swagger-ui-express` em `src/app.ts`.
- **Toda a documentação completa das rotas (parâmetros de query/path/body, modelos de resposta, códigos de status) está centralizada em `/docs`.**

Comando para gerar documentação e rotas:

```bash
npm run tsoa:gen
```

Decisão: TSOA ao invés de `swagger-jsdoc` + comentários JSDoc.
- Justificativa:
  - Não repetir descrição de rotas em comentários e em código.
  - Gerar schemas de forma automática a partir dos tipos TypeScript.

---

## Cache com Redis

### Implementação

- Cliente Redis em `src/lib/redis.ts`:
  - Usa `REDIS_URL` (em produção vindo do App Service, apontando para Azure Cache for Redis).
  - Em ambiente de teste (`NODE_ENV === "test"`), injeta um stub em memória que não faz chamadas externas (evita `ECONNREFUSED` nos testes).

- `EpisodeRepository`:
  - Cacheia:
    - Listagem de episódios (`episodes:list:${page}:${name}:${episode}`)
    - Episódio por ID (`episode:get:${id}`)
  - TTL configurável via `REDIS_EXPIRATION_TIME` em `src/constants.ts`.

- `CharacterRepository`:
  - Cacheia chamadas para `listCharactersByIds` com chave:
    - `characters:listCharactersByIds:${sortedIds.join(",")}`

Decisão: cache na camada de repository.
- Justificativa:
  - Transparência para serviços e controllers.
  - Fácil de invalidar/trocar a estratégia sem quebrar a API pública.

---

## Testes

### Integração

- Localizados em `src/tests/integration/episodes/**`.
- Usam **Supertest** para chamar a API em memória:

```ts
import request from "supertest";
import { app } from "../../../app";

const response = await request(app).get("/episodes");
expect(response.status).toBe(200);
```

- Testes importantes:
  - Listagem de episódios (`GET /episodes`).
  - Paginação de episódios.
  - Listagem de personagens por episódio (`GET /episodes/:id/characters`).
  - Ordenação alfabética dos personagens.

### Decisões sobre Redis em testes

Problema:
- Em ambiente de teste, tentar conectar num Redis real (`localhost:6379`) gera `ECONNREFUSED` e timeouts.

Solução:
- Em `src/lib/redis.ts`, quando `NODE_ENV === "test"`:
  - Exportar um stub que implementa `get`, `setEx` e `on`, mas não faz I/O.
  - `ensureRedisConnected()` simplesmente retorna (não conecta).

Justificativa:
- Mantém testes rápidos e determinísticos.
- Evita dependência de serviços externos durante a execução dos testes.

---

## Execução local

### Pré-requisitos

- Node.js 20+
- npm 10+
- Docker

### Instalação

```bash
git clone <url-do-repo-backend>
cd backend
npm install
```

### Variáveis de ambiente

- Em desenvolvimento:
  - `REDIS_URL` (opcional) – se não definida, usa `redis://localhost:6379`.
  - `PORT` (opcional) – se não definida, o server usa o default configurado no código (ex.: `3000`).

### Rodando em desenvolvimento

```bash
npm run dev
```

API ficará disponível em:
- `http://localhost:3000`
- `http://localhost:3000/episodes`
- `http://localhost:3000/episodes/{id}`
- `http://localhost:3000/episodes/{id}/characters`
- `http://localhost:3000/docs` (Swagger UI)

### Rodando testes

```bash
npm test
```

---

## CI/CD do backend (GitHub Actions)

Workflow: `.github/workflows/backend-ci-cd.yml`

Pipeline (job `build-deploy`):

1. **Checkout** do código.
2. **Node 20** com cache de npm.
3. `npm install` (ou `npm ci`).
4. `npm run tsoa:gen` – gera rotas e swagger.
5. `npm test` – roda testes unitários e de integração.
6. `npm run build` – compila TypeScript para `dist/`.
7. `azure/login@v2` – login na Azure usando Service Principal (`AZURE_CREDENTIALS`).
8. `azure/webapps-deploy@v3` – deploy para o App Service `zrp-rickmorty-api`.

Secrets necessários no repositório:

- `AZURE_CREDENTIALS` – JSON gerado por `az ad sp create-for-rbac ... --sdk-auth`.
- (Opcional) `AZURE_SUBSCRIPTION_ID` se usado por outros steps de ARM/Bicep no mesmo repo.

Decisão: pipeline único (build + test + deploy).
- Justificativa: simplicidade para este desafio; em cenários maiores, poderia ser separado em jobs por estágio (build/test/deploy) e/ou ambientes (dev/stage/prod).

---

## Infraestrutura como código (Bicep + Azure)

Infra definida em um repositório separado de IaC, com ao menos:

- `infra/backend.bicep`
- `infra/main.bicep`
- `.github/workflows/deploy-infra.yml`

### Recursos criados

Com `namePrefix = zrp-rickmorty`, o Bicep cria:

- **App Service Plan**: `zrp-rickmorty-plan`
- **App Service (Linux)**: `zrp-rickmorty-api`
- **Azure Cache for Redis**: `zrp-rickmorty-redis`
- **Key Vault**: `zrp-rickmorty-kv`
- **App Settings** para o App Service:
  - `REDIS_URL` (via referencia ao segredo no Key Vault, quando configurado)
  - `PORT`
  - `NODE_ENV`

Workflow de infra (`deploy-infra.yml`):

- Usa `azure/login@v2` + `azure/arm-deploy@v2` para aplicar `infra/main.bicep` no resource group (ex.: `zrp`).

Decisão: separar infra em outro repositório.
- Justificativa:
  - Isolar responsabilidades (código vs infra).
  - Permitir pipelines e ciclos de deploy independentes.

---

## Melhorias e funcionalidades futuras

- **Busca espacial de personagens por localização (geoprocessamento)**  
  - Cada `Character` já possui um atributo `location` (nome e URL). Uma evolução natural seria enriquecer esse atributo com **geometrias pontuais** (latitude/longitude) associadas a cada localização, construindo assim uma camada espacial do universo de Rick and Morty.  
  - No frontend, o usuário poderia interagir com um **mapa interativo** (ex.: usando Leaflet ou Mapbox GL) e desenhar um **polígono** representando uma área de interesse (AOI). Esse polígono seria serializado em formato **GeoJSON** e enviado para o backend em uma nova rota (por exemplo, `POST /characters/spatial-query`).  
  - No backend, o polígono GeoJSON seria usado para executar uma operação de **“point-in-polygon”** (teste de inclusão de ponto em polígono) sobre a geometria das locations dos personagens, utilizando uma biblioteca de geoprocessamento (ex.: Turf.js) ou um backend espacial especializado (ex.: PostGIS) se a persistência spatialized fosse adotada.  
  - O resultado seria um subconjunto de personagens cujas **coordenadas de localização estão contidas no polígono enviado**, permitindo consultas espaciais avançadas (análises por região, hotspots, etc.) e abrindo espaço para funcionalidades como buffers, interseção entre múltiplas AOIs e visualizações temáticas no frontend.

- **Estratégias de cache mais avançadas**
  - Expiração diferenciada por rota/tipo de dado.
  - Invalidação de cache sob demanda.
  - Métricas de hit/miss do cache.

- **Observabilidade**
  - Integração com Application Insights (logs estruturados, traces, métricas).

- **Autenticação e rate limiting**
  - Adicionar camada de auth (API Key, OAuth2, etc.) se necessário.
  - Rate limiting por IP ou API key para proteção contra abuso.

- **Feature flags e ambientes**
  - Separar ambientes (dev, stage, prod) com pipelines e configurações específicos.
  - Utilizar feature flags para ativar/validar novas funcionalidades gradualmente.

- **Melhorias nos testes**
  - Aumentar cobertura com testes unitários
  - Testes de contrato (Contract Tests) entre backend e frontend.




# **API Cubos Movies \- Backend**

Esta é a documentação para o backend da aplicação Cubos Movies, desenvolvida como parte do desafio técnico da Cubos Tecnologia. A API é responsável por toda a gestão de usuários, filmes, autenticação e serviços de suporte como envio de e-mails e armazenamento de arquivos.

## **🚀 Funcionalidades**

- **Gestão de Usuários**:
  - Cadastro de novos usuários com confirmação por e-mail.
  - Autenticação via Login com JWT (JSON Web Tokens).
  - Funcionalidade de "Esqueci minha senha" com envio de token de recuperação por e-mail.
  - Gestão de perfil (visualizar, atualizar e deletar a própria conta).
  - Listagem de todos os usuários (rota protegida).
- **Gestão de Filmes**:
  - Operações CRUD completas (Criar, Ler, Atualizar, Deletar) para filmes.
  - **Controle de Posse**: Apenas o usuário que cadastrou um filme pode editá-lo ou excluí-lo.
  - Upload de imagens de pôster para um bucket na AWS S3.
  - Listagem de **todos os filmes** da plataforma (pública para usuários logados).
  - Listagem apenas dos **filmes do próprio usuário**.
  - Suporte a filtros, busca e paginação em ambas as listagens.
- **Serviços Agendados**:
  - Um "cron job" diário que verifica os filmes com data de estreia no dia e envia um e-mail de lembrete aos usuários que os cadastraram.

## **🛠️ Tecnologias Utilizadas**

- **Plataforma**: Node.js
- **Linguagem**: TypeScript
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL (gerenciado com Docker)
- **ORM**: Prisma (com Migrations)
- **Autenticação**: JSON Web Tokens
- **Armazenamento de Arquivos**: AWS S3
- **Envio de E-mails**: Resend
- **Tarefas Agendadas**: node-cron
- **Segurança**: bcryptjs para hashing de senhas, cors para segurança de requisições.

## **📋 Pré-requisitos**

Antes de começar, certifique-se de que tem as seguintes ferramentas instaladas na sua máquina:

- [Node.js](https://nodejs.org/en/) (v18 ou superior)
- [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose

## **⚙️ Instalação e Execução**

Siga os passos abaixo para rodar o backend localmente.

1. **Entre no diretório do projeto**:  
   cd my-movie-app/backend

2. **Instale as dependências**:  
   npm install

3. **Configure as Variáveis de Ambiente**:

   - Renomeie o arquivo .env.example (se houver) para .env.
   - Preencha todas as variáveis no arquivo .env com as suas credenciais:

   ```
    Banco de Dados (PostgreSQL)
    DATABASE\_URL="postgresql://user:password@localhost:5432/moviesdb"

    Autenticação (JWT)
    JWT\_SECRET="SEU\_SEGREDO\_SUPER\_SECRETO\_AQUI"

    Serviço de E-mail (Resend)
    RESEND\_API\_KEY="sua\_chave\_api\_do\_resend"

    Armazenamento de Arquivos (AWS S3)
    APP\_AWS\_ACCESS\_KEY="seu\_access\_key\_id\_da\_aws"
    APP\_AWS\_SECRET\_ACCESS\_KEY="seu\_secret\_access\_key\_da\_aws"
    AWS\_S3\_BUCKET\_NAME="nome\_do\_seu\_bucket\_s3"
    AWS\_S3\_REGION="regiao\_do\_seu\_bucket\_s3" ex: us-east-1
   ```

4. **Inicie o Banco de Dados com Docker**:

   - Navegue para a pasta raiz do projeto (my-movie-app).
   - Execute o comando:  
     docker-compose up \-d

5. **Execute as Migrations do Prisma**:

   - Volte para a pasta backend.
   - Este comando irá criar as tabelas no seu banco de dados.  
     npx prisma migrate dev

6. **Inicie o Servidor de Desenvolvimento**:  
   npm run dev

   O servidor estará rodando em http://localhost:3001.

## **📚 Documentação da API (Endpoints)**

A URL base para todos os endpoints é http://localhost:3001/api.

### **Usuários (/users)**

#### **POST /users/register**

- **Descrição**: Registra um novo usuário.
- **Protegido**: Não
- **Corpo da Requisição**:  
  {  
   "name": "Nome do Usuário",  
   "email": "usuario@exemplo.com",  
   "password": "senhaSegura123"  
  }

#### **POST /users/login**

- **Descrição**: Autentica um usuário e retorna um token JWT.
- **Protegido**: Não
- **Corpo da Requisição**:  
  {  
   "email": "usuario@exemplo.com",  
   "password": "senhaSegura123"  
  }

#### **GET /users**

- **Descrição**: Lista todos os usuários registrados.
- **Protegido**: Sim (Requer Bearer Token)

### **Filmes (/movies)**

**Nota**: Todas as rotas de filmes são protegidas e requerem um Bearer Token de autenticação.

#### **POST /movies**

- **Descrição**: Cria um novo filme associado ao usuário autenticado. A requisição deve ser do tipo multipart/form-data.
- **Corpo da Requisição (form-data)**:
  - title (texto): Título do filme
  - description (texto): Descrição do filme
  - durationInMinutes (texto): Duração em minutos
  - releaseDate (texto): Data de lançamento (formato AAAA-MM-DD)
  - poster (arquivo): Imagem do pôster (opcional)

#### **GET /movies**

- **Descrição**: Lista **todos os filmes** cadastrados na plataforma, de todos os usuários. Suporta filtros via query string.
- **Parâmetros de Query (opcionais)**:
  - page: Número da página (ex: ?page=2)
  - search: Texto para buscar no título (ex: ?search=Matrix)
  - duration: Duração máxima em minutos (ex: ?duration=120)
- **Resposta de Sucesso (200 OK)**:  
  {  
   "data": \[  
   { "id": 1, "title": "Filme Um", ... },  
   { "id": 2, "title": "Filme Dois", ... }  
   \],  
   "currentPage": 1,  
   "totalPages": 5,  
   "totalCount": 50  
  }

#### **GET /movies/:id**

- **Descrição**: Busca um filme específico pelo ID, se pertencer ao utilizador.
- **Resposta de Sucesso (200 OK)**: Objeto do filme.

#### **PATCH /movies/:id**

- **Descrição**: Atualiza um filme pelo ID, se pertencer ao utilizador. A requisição deve ser multipart/form-data se incluir um novo pôster.
- **Corpo da Requisição (form-data)**: Campos a serem atualizados.

#### **DELETE /movies/:id**

- **Descrição**: Deleta um filme pelo ID, se pertencer ao utilizador.
- **Resposta de Sucesso (204 No Content)**.

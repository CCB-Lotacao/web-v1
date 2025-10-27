# Projeto Frontend

## Configuração

Este projeto está configurado para se conectar com o backend rodando em `localhost:3000`.

## Como usar

### 1. Instalar dependências

```bash
yarn install
```

### 2. Certifique-se que o backend está rodando

O backend deve estar rodando em `http://localhost:3000`

### 3. Iniciar o servidor de desenvolvimento

```bash
yarn dev
```

O aplicativo estará disponível em `http://localhost:5173`

## Estrutura do Projeto

### 📁 src/

- **main.tsx**: Ponto de entrada da aplicação
- **App.tsx**: Componente principal com roteamento
- **index.css**: Estilos globais

### 📁 src/pages/

- **Login**: Tela de login (index.tsx)
- **Dashboard**: Tela principal após login (index.tsx)

### 📁 src/service/

- **auth.ts**: Service de autenticação que se conecta com o backend
  - `login()`: Faz login no backend
  - `logout()`: Faz logout e limpa localStorage
  - `isAuthenticated()`: Verifica se está autenticado
  - `getCurrentUser()`: Retorna dados do usuário atual

## API Endpoints

O service de autenticação faz requisições para:

- `POST http://localhost:3000/api/auth/login` - Endpoint de login

Certifique-se de que seu backend tem um endpoint de login que aceita:

```json
{
  "email": "string",
  "password": "string"
}
```

E retorna:

```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

## Roteamento

- `/` → Redireciona para `/login`
- `/login` → Tela de login
- `/dashboard` → Tela principal (requer autenticação)

## Token Storage

O token de autenticação é armazenado no `localStorage` e enviado automaticamente em todas as requisições via interceptor do axios.

## Proxy

O Vite está configurado com proxy para `/api` redirecionando para `http://localhost:3000`, então você pode fazer requisições para `/api/auth/login` que serão automaticamente direcionadas para o backend.

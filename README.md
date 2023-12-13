# Daily Diet API

## Sobre o projeto

Este projeto é uma API desenvolvida como parte de um desafio proposto pela Rocketseat. A Daily Diet API é uma aplicação para controle de dieta diária, permitindo aos usuários registrar suas refeições, acompanhar métricas e manter o controle sobre sua alimentação.

## Funcionalidades

- Cadastro de Usuário:
    - Crie um usuário para começar a utilizar a aplicação.
- Autenticação de Usuário:
    - Identifique o usuário em todas as requisições para garantir segurança e personalização.
- Registro de Refeições:
    - Registre suas refeições, incluindo nome, descrição, data e hora, e se a refeição está ou não dentro da dieta.
- Edição de Refeições:
    - Altere as informações de uma refeição existente, incluindo nome, descrição, data e hora, e estado na dieta.
- Exclusão de Refeições:
    - Apague uma refeição registrada.
- Listagem de Refeições:
    - Obtenha uma lista de todas as refeições registradas por um usuário.
- Visualização de Refeição Individual:
    - Veja os detalhes de uma refeição específica.
- Métricas do Usuário:
    - Recupere métricas relacionadas ao usuário, incluindo quantidade total de refeições registradas, quantidade dentro da dieta, quantidade fora da dieta e a melhor sequência de refeições dentro da dieta.
- Restrições de Acesso:
    - Garanta que os usuários só possam visualizar, editar e apagar as refeições que eles próprios criaram.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Banco de Dados: SQLite

## Executando o projeto

1. Clone o repositório.
2. Instale as dependências com o comando: `yarn`
3. Configure as variáveis de ambiente no arquivo `.env` conforme o modelo fornecido no arquivo `.env.example`.
4. Execute as migrations no backend para que sejam criadas as tabelas do banco de dados: `yarn run knex -- migrate:latest`.
5. Execute o servidor: `yarn start`.

O servidor irá rodar na porta 3000, caso não seja alterada a porta.

Certifique-se de ter o Node.js e o yarn instalados em sua máquina.

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções neste projeto. Crie um fork do repositório, faça suas alterações e envie um pull request. Estamos abertos a sugestões!

---

**Desenvolvido por Lizandra Malta - github.com/lizandramalta**

_Este projeto foi desenvolvido como parte do desafio proposto pela Rocketseat._
# API FileSaver

## Descrição

A API FileSaver permite o upload/download de arquivos de diversos dispositivos em uma mesma rede local para um desktop no qual ela esteja sendo executada. Além disso, ela permite que usuários se autentiquem e façam o gerenciamento de seus arquivos nessa máquina como por exemplo, mover, copiar deletar os arquivos já salvos através da API.

Esta API é conta com funcionalidades de:

- <b>Gerenciamento de usuário</b>, ainda que simplificado atravez de usename e password. A cada usuário do sistema será destina um diretório próprio onde outro usuário não terá acesso a ele por meio dessa API.<br>
- <b>Gerenciamento de arquivos</b><br> -<i>Upload</i><br> -<i>Download</i><br> -<i>Mover</i><br> -<i>Copiar</i><br> -<i>Mover para lixeira</i><br> -<i>Deletar</i><br>
- <b>Gerenciamento de diretórios</b><br> -<i>Mover</i><br> -<i>Copiar</i><br> -<i>Mover para lixeira</i><br> -<i>Deletar</i><br>

### Motivação

Ao enfretar problemas ao conectar meu smartphone ao meu notebook pelo app da microsoft ou via bluetooth e não conseguir, resolvi, eu mesmo, implementar a solução para meu problema. Agora, com minha api serei capaz de definir uma pasta em algum computador que servirá como um servidor no qual serei capaz de ter salvar, acesso e manipular arquivos com qualquer dispositivo que contenha alguma aplicação que consuma essa API.

---

## Instalação

Antes de começar, certifique-se de ter o <b>Node.js</b> (versão igual ou superior <i>20.11</i>) e o <b>npm</b> (versão igual ou superior a <i>10.9</i>) instalados em sua máquina.

**1. Clone o Repositório:**
`git clone `

**2. Navegue até o Diretório do Projeto:**
`cd `

**3. Instale as Dependências:**
`npm install`

**4. Prepare o Husky**
`npm run rusky:prepare`

---

## Scripts Disponíveis

**- Compilação do Código:**
`npm run build`

**- Iniciar a Aplicação:**
`npm start`

**- Modo de Desenvolvimento:**
`npm run start:dev`

**- Execução de Testes:**
`npm test`

**- Testes em Modo de Observação:**
`npm run test:watch`

---

## Contribuição

1. Faça o fork do projeto [Fork](https://github.com/Lucas-Amorim-Almeida/FileSaver/fork)
2. Crie uma branch para sua modificação (git checkout -b feature/nova-feature)
3. Faça o commit das suas alterações (git commit -am 'Adicionando nova feature')
4. Faça o push para a branch (git push origin feature/nova-feature)
5. Crie um novo Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

© 2025 API Personal-Library. Desenvolvido por [Lucas Amorim Almeida](https://github.com/Lucas-Amorim-Almeida)

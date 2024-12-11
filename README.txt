É bem fácil de rodar, no frontend (se já não tiver adicionado), no arquivo .env.local você vai adicionar estas informações:

# API
NEXT_PUBLIC_API_URL= 'http://127.0.0.1'

NEXT_PUBLIC_API_PORTA= '3333'
# NEXT_PUBLIC_API_KEY=abcdef123456



Já na API serão estas informações no arquivo src/database/connection.js de acordo com o seu usuário, senha e banco criado no banco de dados MySQL:

 const mysql = require ('mysql2/promise')

 const bd_usuario = 'root';
 const bd_senha = '1234';
 const bd_servidor = '127.0.0.1';
 const bd_porta = '3306';
 const bd_banco = 'Dani'

 let connection
 
 const config = {
     host: bd_servidor,
     port: bd_porta,
     user: bd_usuario,
     password: bd_senha,
     database: bd_banco,
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0,
 }
 try {
     connection = mysql.createPool(config);
     console.log ('Conexão estabelecida com sucesso')
 } catch (error) {
     console.log (error);
 }

module.exports = connection;



Informações para criar o banco para alimentar este projeto:

CREATE DATABASE Dani;
USE Dani;

CREATE TABLE tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status ENUM('pendente', 'concluida') DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE tarefas ADD COLUMN userId INT NOT NULL;

Após estas configurações é só entrar no terminal do seu editor de código-fonte digitar "cmd" e em seguida "npm run dev" e clicar no link que ele irá te fornecer, depois é só aguardar que o projeto irá rodar.




FUNCIONALIDADES IMPLEMENTADAS
Quando rodar ele irá cair direto na página principal, porém se você não estiver logado ele te jogará para tela de login;
Se não haver nenhum cadastro seu realizado é só ir até a página de signUp e realizar seu cadastro, tendo validação em todos os campos para não serem null, tbm tem um comparativo entre a senha e a cofirmação da senha e validação de senha forte contedo mais de 8 caracteres tendo entre eles números e caracteres especiais;
Há validação no login também, tanto no frontend, quanto no backend;
A senha quando ela é armazenada no banco ela vai com criptografia, não sendo possível vê-la;
Na tela principal você pode fazer logoff, adicionar uma nova tarefa, ver as tarefas da pessoa logada com um filtro, sendo elas pendentes ou concluidas, pode fazer a exclusão da tarefa e a edição tarefa, que é aberta em um modal;
Ainda na página principal podemos acessar o perfil vendo as informações da pessoa logada e sendo possível editá-las;
Se você estiver na tela de editar perfil e quiser voltar é só clicar em cima de "Perfil" que você será direcionado para tela de perfil sem edição e se quiser voltar para tela principal é só clicar em "Perfil" na tela de perfil;
Quando adicionar uma tarefa, concluir ou deletar dê reload para ver a mudança.







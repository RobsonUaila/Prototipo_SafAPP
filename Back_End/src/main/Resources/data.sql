-- Inserir usuários de exemplo
INSERT INTO usuarios (id, nome, email, senha, tipo, data_criacao, ativo) VALUES
(1, 'Cliente Teste', 'cliente@teste.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTV2UiC', 'CLIENTE', NOW(), true),
(2, 'Funcionário Teste', 'funcionario@teste.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTV2UiC', 'FUNCIONARIO', NOW(), true),
(3, 'Gestor Teste', 'gestor@teste.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTV2UiC', 'GESTOR', NOW(), true);

INSERT INTO clientes (usuario_id, telefone) VALUES (1, '+258 84 123 4567');
INSERT INTO funcionarios (usuario_id, cargo) VALUES (2, 'Atendente');
INSERT INTO gestores (usuario_id, departamento) VALUES (3, 'Administração');

-- Inserir filmes de exemplo
INSERT INTO filmes (id, titulo, genero, ano, sinopse, duracao, classificacao, preco, disponivel, imagem_url) VALUES
(1, 'Avatar: O Caminho da Água', 'Ficção Científica', 2022, 'Sequência do filme Avatar', '192 min', '12+', 5.99, true, 'https://source.unsplash.com/random/300x450/?avatar'),
(2, 'John Wick 4', 'Ação', 2023, 'Quarta parte da série John Wick', '169 min', '16+', 4.99, true, 'https://source.unsplash.com/random/300x450/?action'),
(3, 'Oppenheimer', 'Drama', 2023, 'Biografia do pai da bomba atômica', '180 min', '14+', 6.99, true, 'https://source.unsplash.com/random/300x450/?drama'),
(4, 'Super Mario Bros', 'Animação', 2023, 'Aventura do Mario e Luigi', '92 min', 'L', 4.49, true, 'https://source.unsplash.com/random/300x450/?animation');
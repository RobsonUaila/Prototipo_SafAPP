const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dados de exemplo
let movies = [
    {
        id: 1,
        title: "Avatar: O Caminho da Água",
        genre: "Ficção Científica",
        year: 2022,
        price: 5.99,
        available: true,
        imageUrl: "https://source.unsplash.com/random/300x450/?avatar"
    },
    {
        id: 2,
        title: "John Wick 4",
        genre: "Ação",
        year: 2023,
        price: 4.99,
        available: true,
        imageUrl: "https://source.unsplash.com/random/300x450/?action"
    },
    {
        id: 3,
        title: "Oppenheimer",
        genre: "Drama",
        year: 2023,
        price: 6.99,
        available: true,
        imageUrl: "https://source.unsplash.com/random/300x450/?drama"
    }
];

let users = [];
let rentals = [];

// ==================== MIDDLEWARE DE LOG ====================
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ==================== ROTAS DE AUTENTICAÇÃO ====================

// Registro de usuário
app.post('/api/auth/register', (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        // Validação simples
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: 'Nome, email e senha são obrigatórios' 
            });
        }
        
        // Verificar se usuário já existe
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Usuário já existe' 
            });
        }
        
        // Criar novo usuário
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password, // Em produção, usar bcrypt!
            phone,
            role: 'client',
            createdAt: new Date()
        };
        
        users.push(newUser);
        
        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Erro interno do servidor',
            error: error.message 
        });
    }
});

// Login de usuário
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validação
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email e senha são obrigatórios' 
            });
        }
        
        // Encontrar usuário
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            return res.status(401).json({ 
                message: 'Credenciais inválidas' 
            });
        }
        
        // Simular token JWT
        const token = `fake-jwt-token-${user.id}-${Date.now()}`;
        
        res.json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Erro interno do servidor',
            error: error.message 
        });
    }
});

// ==================== ROTAS DE FILMES ====================

// Listar todos os filmes
app.get('/api/movies', (req, res) => {
    try {
        const { search, genre } = req.query;
        
        let filteredMovies = movies;
        
        // Filtro por pesquisa
        if (search) {
            filteredMovies = filteredMovies.filter(movie =>
                movie.title.toLowerCase().includes(search.toLowerCase()) ||
                movie.genre.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        // Filtro por gênero
        if (genre && genre !== 'Todos') {
            filteredMovies = filteredMovies.filter(movie =>
                movie.genre.toLowerCase().includes(genre.toLowerCase())
            );
        }
        
        res.json({
            count: filteredMovies.length,
            movies: filteredMovies
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Erro ao buscar filmes',
            error: error.message 
        });
    }
});

// Buscar filme por ID
app.get('/api/movies/:id', (req, res) => {
    try {
        const movieId = parseInt(req.params.id);
        const movie = movies.find(m => m.id === movieId);
        
        if (!movie) {
            return res.status(404).json({ 
                message: 'Filme não encontrado' 
            });
        }
        
        res.json(movie);
    } catch (error) {
        res.status(500).json({ 
            message: 'Erro ao buscar filme',
            error: error.message 
        });
    }
});

// ==================== ROTAS DE ALUGUEL ====================

// Alugar um filme
app.post('/api/rentals', (req, res) => {
    try {
        const { movieId, userId, days = 7 } = req.body;
        
        // Validar dados
        if (!movieId || !userId) {
            return res.status(400).json({ 
                message: 'ID do filme e ID do usuário são obrigatórios' 
            });
        }
        
        const movie = movies.find(m => m.id === movieId);
        const user = users.find(u => u.id === userId);
        
        if (!movie) {
            return res.status(404).json({ 
                message: 'Filme não encontrado' 
            });
        }
        
        if (!user) {
            return res.status(404).json({ 
                message: 'Usuário não encontrado' 
            });
        }
        
        if (!movie.available) {
            return res.status(400).json({ 
                message: 'Filme não está disponível' 
            });
        }
        
        // Criar aluguel
        const newRental = {
            id: rentals.length + 1,
            movieId,
            userId,
            movieTitle: movie.title,
            userName: user.name,
            startDate: new Date(),
            endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
            totalPrice: movie.price * days,
            status: 'active'
        };
        
        rentals.push(newRental);
        
        // Marcar filme como indisponível
        movie.available = false;
        
        res.status(201).json({
            message: 'Filme alugado com sucesso',
            rental: newRental
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Erro ao processar aluguel',
            error: error.message 
        });
    }
});

// Listar aluguéis do usuário
app.get('/api/rentals/user/:userId', (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const userRentals = rentals.filter(rental => rental.userId === userId);
        
        res.json({
            count: userRentals.length,
            rentals: userRentals
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Erro ao buscar aluguéis',
            error: error.message 
        });
    }
});

// ==================== ROTAS BÁSICAS ====================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'SAF-app Backend está funcionando!',
        timestamp: new Date().toISOString(),
        stats: {
            movies: movies.length,
            users: users.length,
            rentals: rentals.length
        }
    });
});

// Rota principal
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>SAF-app Backend</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    margin: 0; 
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    color: white;
                }
                .container { 
                    max-width: 1200px; 
                    margin: 0 auto;
                    background: rgba(255,255,255,0.1);
                    padding: 30px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                }
                h1 { color: #fff; text-align: center; margin-bottom: 30px; }
                .stats { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px; 
                    margin: 30px 0;
                }
                .stat-card { 
                    background: rgba(255,255,255,0.2); 
                    padding: 20px; 
                    border-radius: 10px; 
                    text-align: center;
                }
                .endpoint { 
                    background: rgba(255,255,255,0.15); 
                    padding: 15px; 
                    margin: 10px 0; 
                    border-radius: 8px;
                }
                code { 
                    background: rgba(0,0,0,0.3); 
                    color: #fff; 
                    padding: 4px 8px; 
                    border-radius: 4px;
                    font-family: 'Courier New', monospace;
                }
                .success { 
                    color: #00ff88; 
                    font-weight: bold;
                    text-align: center;
                    font-size: 1.2em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 SAF-app Backend - Sistema de Aluguer de Filmes</h1>
                <p class="success">✅ Servidor está funcionando corretamente!</p>
                
                <div class="stats">
                    <div class="stat-card">
                        <h3>🎬 Filmes</h3>
                        <p style="font-size: 2em; margin: 10px 0;">${movies.length}</p>
                    </div>
                    <div class="stat-card">
                        <h3>👥 Usuários</h3>
                        <p style="font-size: 2em; margin: 10px 0;">${users.length}</p>
                    </div>
                    <div class="stat-card">
                        <h3>📦 Aluguéis</h3>
                        <p style="font-size: 2em; margin: 10px 0;">${rentals.length}</p>
                    </div>
                </div>
                
                <h2>🌐 Endpoints Disponíveis</h2>
                
                <div class="endpoint">
                    <h3>🔐 Autenticação</h3>
                    <p><code>POST /api/auth/register</code> - Registrar usuário</p>
                    <p><code>POST /api/auth/login</code> - Fazer login</p>
                </div>
                
                <div class="endpoint">
                    <h3>🎥 Filmes</h3>
                    <p><code>GET /api/movies</code> - Listar filmes</p>
                    <p><code>GET /api/movies/:id</code> - Buscar filme por ID</p>
                </div>
                
                <div class="endpoint">
                    <h3>💰 Aluguéis</h3>
                    <p><code>POST /api/rentals</code> - Alugar filme</p>
                    <p><code>GET /api/rentals/user/:userId</code> - Meus aluguéis</p>
                </div>
                
                <div class="endpoint">
                    <h3>⚡ Sistema</h3>
                    <p><code>GET /api/health</code> - Status do servidor</p>
                </div>
                
                <div style="text-align: center; margin-top: 40px; opacity: 0.8;">
                    <p>📚 <strong>Universidade São Tomás de Moçambique</strong></p>
                    <p>Curso de Licenciatura em Desenvolvimento de Software</p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// ==================== MANEJO DE ERROS ====================

// Rota para 404 - CORRIGIDA (sem usar '*')
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.originalUrl,
        method: req.method,
        availableEndpoints: [
            'GET  /',
            'GET  /api/health',
            'POST /api/auth/register',
            'POST /api/auth/login', 
            'GET  /api/movies',
            'GET  /api/movies/:id',
            'POST /api/rentals',
            'GET  /api/rentals/user/:userId'
        ]
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Erro não capturado:', error);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message
    });
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
    console.log('='.repeat(70));
    console.log('🚀 SAF-app Backend iniciado com sucesso!');
    console.log(`📍 Porta: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
    console.log('='.repeat(70));
    console.log('📋 Endpoints disponíveis:');
    console.log('   POST /api/auth/register - Registrar usuário');
    console.log('   POST /api/auth/login   - Fazer login');
    console.log('   GET  /api/movies       - Listar filmes');
    console.log('   POST /api/rentals      - Alugar filme');
    console.log('   GET  /api/health       - Status do servidor');
    console.log('='.repeat(70));
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Desligando servidor gracefulmente...');
    process.exit(0);
});
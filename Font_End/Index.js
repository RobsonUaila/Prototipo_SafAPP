// Configuração da API (aponta para o backend Spring Boot em /api)
const API_BASE_URL = 'http://localhost:8080/api';

// Elementos DOM
const moviesContainer = document.getElementById('moviesContainer');
const authModal = document.getElementById('authModal');
// ... outros elementos

// Serviço de Autenticação
class AuthService {
    static getToken() {
        return localStorage.getItem('token');
    }

    static setToken(token) {
        localStorage.setItem('token', token);
    }

    static removeToken() {
        localStorage.removeItem('token');
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static getAuthHeaders() {
        return {
            'Authorization': `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        };
    }
}

// Serviço da API
class ApiService {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Adicionar token de autenticação se disponível
        if (AuthService.isAuthenticated() && !endpoint.includes('/auth')) {
            config.headers['Authorization'] = `Bearer ${AuthService.getToken()}`;
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Autenticação
    static async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha: password })
        });
    }

    static async register(userData) {
        return this.request('/auth/registro', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // Filmes
    static async getFilmes() {
        return this.request('/filmes/disponiveis');
    }

    static async pesquisarFilmes(termo) {
        return this.request(`/filmes/pesquisar?termo=${encodeURIComponent(termo)}`);
    }

    static async getFilmeById(id) {
        return this.request(`/filmes/${id}`);
    }

    // Aluguel
    static async alugarFilme(aluguelData) {
        return this.request('/alugueis', {
            method: 'POST',
            body: JSON.stringify(aluguelData)
        });
    }

    static async getMeusAlugueis() {
        return this.request('/alugueis/meus');
    }
}

// Gerenciamento de Estado
class AppState {
    static usuario = null;
    static filmes = [];
    static carrinho = [];

    static async carregarFilmes() {
        try {
            this.filmes = await ApiService.getFilmes();
            this.renderizarFilmes();
        } catch (error) {
            console.error('Erro ao carregar filmes:', error);
        }
    }

    static renderizarFilmes() {
        moviesContainer.innerHTML = '';
        this.filmes.forEach(filme => {
            const movieCard = this.criarCardFilme(filme);
            moviesContainer.appendChild(movieCard);
        });
    }

    static criarCardFilme(filme) {
        const div = document.createElement('div');
        div.className = 'movie-card';
        div.innerHTML = `
            <img src="${filme.imagemUrl || 'https://source.unsplash.com/random/300x450/?movie'}" 
                 alt="${filme.titulo}" class="movie-poster">
            <div class="movie-info">
                <div class="movie-title">${filme.titulo}</div>
                <div class="movie-details">${filme.genero} • ${filme.ano}</div>
                <div class="movie-price">${filme.preco?.toFixed(2) || '0.00'} MT</div>
                <button class="rent-btn" data-id="${filme.id}">
                    ${filme.disponivel ? 'Alugar' : 'Indisponível'}
                </button>
                ${filme.disponivel ? 
                    '<button class="details-btn" data-id="${filme.id}">Detalhes</button>' : ''}
            </div>
        `;
        return div;
    }
}

// Gerenciamento de Interface
class UIManager {
    static init() {
        this.configurarEventListeners();
        this.verificarAutenticacao();
        AppState.carregarFilmes();
    }

    static configurarEventListeners() {
        // Login/Registro
        document.getElementById('loginBtn').addEventListener('click', () => this.mostrarLogin());
        document.getElementById('registerBtn').addEventListener('click', () => this.mostrarRegistro());
        document.getElementById('closeModal').addEventListener('click', () => this.fecharModal());
        
        // Formulário de autenticação
        document.getElementById('authForm').addEventListener('submit', (e) => this.processarAuth(e));
        
        // Pesquisa
        document.querySelector('.search-btn').addEventListener('click', () => this.pesquisarFilmes());
        document.querySelector('.search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.pesquisarFilmes();
        });

        // Categorias
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filtrarPorCategoria(e.target.textContent));
        });
    }

    static async processarAuth(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const isLogin = document.getElementById('modalTitle').textContent.includes('Entrar');

        try {
            let response;
            if (isLogin) {
                response = await ApiService.login(email, password);
            } else {
                const confirmPassword = document.getElementById('confirmPassword').value;
                if (password !== confirmPassword) {
                    alert('As senhas não coincidem!');
                    return;
                }
                response = await ApiService.register({
                    nome: document.getElementById('name')?.value || 'Cliente',
                    email: email,
                    senha: password,
                    telefone: document.getElementById('phone')?.value || ''
                });
            }

            if (response.token) {
                AuthService.setToken(response.token);
                AppState.usuario = response;
                this.atualizarInterfaceUsuario();
                this.fecharModal();
                alert(isLogin ? 'Login realizado com sucesso!' : 'Registro realizado com sucesso!');
            }
        } catch (error) {
            alert('Erro na autenticação: ' + error.message);
        }
    }

    static async pesquisarFilmes() {
        const termo = document.querySelector('.search-input').value;
        if (termo) {
            try {
                AppState.filmes = await ApiService.pesquisarFilmes(termo);
                AppState.renderizarFilmes();
            } catch (error) {
                console.error('Erro na pesquisa:', error);
            }
        } else {
            AppState.carregarFilmes();
        }
    }

    static async alugarFilme(filmeId) {
        if (!AuthService.isAuthenticated()) {
            alert('Por favor, faça login para alugar filmes!');
            this.mostrarLogin();
            return;
        }

        try {
            const aluguelData = {
                filmeId: filmeId,
                diasAluguel: 7 // Padrão 7 dias
            };
            
            const resultado = await ApiService.alugarFilme(aluguelData);
            alert('Filme alugado com sucesso!');
            // Atualizar interface
        } catch (error) {
            alert('Erro ao alugar filme: ' + error.message);
        }
    }

    static atualizarInterfaceUsuario() {
        const authButtons = document.querySelector('.auth-buttons');
        if (AuthService.isAuthenticated()) {
            authButtons.innerHTML = `
                <span>Olá, ${AppState.usuario?.nome}</span>
                <button class="btn btn-outline" id="logoutBtn">Sair</button>
                <button class="btn btn-primary" id="profileBtn">Meu Perfil</button>
            `;
            document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        } else {
            authButtons.innerHTML = `
                <button class="btn btn-outline" id="loginBtn">Entrar</button>
                <button class="btn btn-primary" id="registerBtn">Registrar</button>
            `;
        }
    }

    static logout() {
        AuthService.removeToken();
        AppState.usuario = null;
        this.atualizarInterfaceUsuario();
        alert('Logout realizado com sucesso!');
    }

    static mostrarLogin() {
        document.getElementById('modalTitle').textContent = 'Entrar na Conta';
        document.getElementById('submitAuthBtn').textContent = 'Entrar';
        document.getElementById('confirmPasswordGroup').style.display = 'none';
        authModal.style.display = 'flex';
    }

    static mostrarRegistro() {
        document.getElementById('modalTitle').textContent = 'Criar Conta';
        document.getElementById('submitAuthBtn').textContent = 'Registrar';
        document.getElementById('confirmPasswordGroup').style.display = 'block';
        authModal.style.display = 'flex';
    }

    static fecharModal() {
        authModal.style.display = 'none';
        document.getElementById('authForm').reset();
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    UIManager.init();
});

// Delegation de eventos para elementos dinâmicos
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('rent-btn')) {
        const filmeId = e.target.getAttribute('data-id');
        UIManager.alugarFilme(filmeId);
    }
    
    if (e.target.classList.contains('details-btn')) {
        const filmeId = e.target.getAttribute('data-id');
        UIManager.mostrarDetalhesFilme(filmeId);
    }
});
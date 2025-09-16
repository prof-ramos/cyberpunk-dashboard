#!/bin/bash

# Cyberpunk Dashboard - Setup Script
# ==================================
# Este script automatiza a configuração completa do projeto Cyberpunk Dashboard
# Inclui instalação de dependências, configuração do banco e inicialização

set -e  # Exit on any error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para verificar versão do Node.js
check_node_version() {
    if command_exists node; then
        local version=$(node --version | sed 's/v//')
        local major=$(echo $version | cut -d. -f1)
        if [ "$major" -ge 18 ]; then
            print_success "Node.js $version encontrado ✓"
            return 0
        else
            print_error "Node.js $version encontrado, mas versão 18+ é necessária"
            return 1
        fi
    else
        print_error "Node.js não encontrado"
        return 1
    fi
}

# Função para verificar versão do pnpm
check_pnpm_version() {
    if command_exists pnpm; then
        local version=$(pnpm --version)
        print_success "pnpm $version encontrado ✓"
        return 0
    else
        print_error "pnpm não encontrado"
        return 1
    fi
}

# Função para verificar Docker
check_docker() {
    if command_exists docker; then
        local version=$(docker --version | sed 's/Docker version //' | cut -d, -f1)
        print_success "Docker $version encontrado ✓"
        return 0
    else
        print_warning "Docker não encontrado - será usado modo sem container"
        return 1
    fi
}

# Função para verificar Docker Compose
check_docker_compose() {
    if command_exists docker-compose || command_exists "docker compose"; then
        print_success "Docker Compose encontrado ✓"
        return 0
    else
        print_warning "Docker Compose não encontrado - será usado modo sem container"
        return 1
    fi
}

# Função para instalar dependências do sistema
install_system_deps() {
    print_step "Verificando dependências do sistema..."

    # macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if ! command_exists brew; then
            print_error "Homebrew não encontrado. Instale em: https://brew.sh/"
            exit 1
        fi

        print_info "Instalando dependências no macOS..."

        # Node.js via nvm se não estiver instalado
        if ! command_exists node; then
            print_info "Instalando Node.js..."
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
            nvm install 18
            nvm use 18
        fi

        # pnpm
        if ! command_exists pnpm; then
            print_info "Instalando pnpm..."
            brew install pnpm
        fi

        # Docker (opcional)
        if ! command_exists docker; then
            print_warning "Docker não encontrado. Instale Docker Desktop para macOS"
        fi

    # Linux
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_info "Instalando dependências no Linux..."

        # Node.js
        if ! command_exists node; then
            print_info "Instalando Node.js..."
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        fi

        # pnpm
        if ! command_exists pnpm; then
            print_info "Instalando pnpm..."
            npm install -g pnpm
        fi

        # Docker (opcional)
        if ! command_exists docker; then
            print_warning "Docker não encontrado. Instale Docker seguindo: https://docs.docker.com/engine/install/"
        fi

    # Windows (WSL)
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        print_error "Para Windows, use WSL2 ou execute manualmente:"
        echo "1. Instale Node.js 18+: https://nodejs.org/"
        echo "2. Instale pnpm: npm install -g pnpm"
        echo "3. Instale Docker Desktop: https://www.docker.com/products/docker-desktop"
        exit 1
    fi
}

# Função para configurar variáveis de ambiente
setup_environment() {
    print_step "Configurando variáveis de ambiente..."

    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            print_success "Arquivo .env.local criado a partir do .env.example"
        else
            print_error "Arquivo .env.example não encontrado"
            return 1
        fi
    else
        print_info "Arquivo .env.local já existe"
    fi

    print_warning "IMPORTANTE: Configure suas variáveis de ambiente em .env.local"
    print_info "Variáveis obrigatórias:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo "  - ADMIN_API_KEY (mínimo 32 caracteres)"
    echo "  - WEBHOOK_SECRET (mínimo 16 caracteres)"
    echo "  - WEBHOOK_API_KEY (mínimo 32 caracteres)"

    read -p "Pressione ENTER quando configurar as variáveis de ambiente..."
}

# Função para instalar dependências do projeto
install_dependencies() {
    print_step "Instalando dependências do projeto..."

    if command_exists pnpm; then
        print_info "Instalando dependências com pnpm..."
        pnpm install
        print_success "Dependências instaladas com sucesso ✓"
    else
        print_error "pnpm não encontrado"
        return 1
    fi
}

# Função para configurar banco de dados
setup_database() {
    print_step "Configurando banco de dados..."

    if [ ! -d "scripts" ]; then
        print_error "Diretório scripts/ não encontrado"
        return 1
    fi

    print_info "Scripts SQL encontrados:"
    ls -1 scripts/*.sql 2>/dev/null || print_warning "Nenhum script SQL encontrado"

    print_info "Para configurar o banco de dados:"
    echo "1. Execute os scripts SQL em ordem no Supabase:"
    echo "   - scripts/001_create_webhook_tables.sql"
    echo "   - scripts/002_create_request_logs.sql"
    echo "   - scripts/003_create_processing_logs.sql"
    echo "   - scripts/004_create_helper_functions.sql"
    echo ""
    echo "2. Ou use o endpoint /api/admin/database-status para verificar"
    echo ""
    echo "3. Para desenvolvimento local com Docker:"
    echo "   make dev  # Inicia PostgreSQL local"
}

# Função para executar verificações finais
run_checks() {
    print_step "Executando verificações finais..."

    # Verificar se build funciona
    if command_exists pnpm; then
        print_info "Verificando build..."
        if pnpm build --dry-run 2>/dev/null; then
            print_success "Build check passou ✓"
        else
            print_warning "Build check falhou - verifique dependências"
        fi
    fi

    # Verificar linting
    if command_exists pnpm; then
        print_info "Verificando linting..."
        if pnpm lint --max-warnings 0 2>/dev/null; then
            print_success "Linting passou ✓"
        else
            print_warning "Linting falhou - execute 'pnpm lint' para detalhes"
        fi
    fi
}

# Função para mostrar próximos passos
show_next_steps() {
    print_success "Setup concluído! 🎉"
    echo ""
    print_info "Próximos passos:"
    echo ""
    echo "1. Configure suas variáveis de ambiente em .env.local"
    echo "2. Configure o banco de dados no Supabase"
    echo "3. Execute o projeto:"
    echo "   pnpm dev                    # Desenvolvimento"
    echo "   pnpm build && pnpm start    # Produção"
    echo ""
    echo "4. Com Docker:"
    echo "   make dev                    # Desenvolvimento"
    echo "   make prod                   # Produção"
    echo ""
    echo "5. Acesse:"
    echo "   http://localhost:3000       # Aplicação"
    echo "   http://localhost:5050       # pgAdmin (se usar Docker)"
    echo ""
    print_info "Documentação:"
    echo "   README.md                   # Documentação principal"
    echo "   README-Docker.md           # Setup com Docker"
    echo "   DEPLOYMENT_GUIDE.md        # Guia de deploy"
    echo "   AGENTS.md                  # Configurações para agentes"
}

# Função principal
main() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    CYBERPUNK DASHBOARD                      ║"
    echo "║                      SETUP SCRIPT                           ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""

    print_info "Bem-vindo ao assistente de setup do Cyberpunk Dashboard!"
    echo ""

    # Verificar se está no diretório correto
    if [ ! -f "package.json" ] || [ ! -f "next.config.mjs" ]; then
        print_error "Execute este script na raiz do projeto Cyberpunk Dashboard"
        exit 1
    fi

    # Verificações de pré-requisitos
    print_step "Verificando pré-requisitos..."

    local deps_ok=true

    if ! check_node_version; then deps_ok=false; fi
    if ! check_pnpm_version; then deps_ok=false; fi
    check_docker || true  # Não é obrigatório
    check_docker_compose || true  # Não é obrigatório

    if [ "$deps_ok" = false ]; then
        echo ""
        read -p "Algumas dependências estão faltando. Deseja instalá-las automaticamente? (y/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_system_deps
        else
            print_error "Instale as dependências manualmente e execute o script novamente"
            exit 1
        fi
    fi

    # Configurar ambiente
    setup_environment

    # Instalar dependências
    install_dependencies

    # Configurar banco de dados
    setup_database

    # Executar verificações
    run_checks

    # Mostrar próximos passos
    show_next_steps

    echo ""
    print_success "Setup concluído com sucesso! 🚀"
    echo ""
}

# Executar função principal
main "$@"
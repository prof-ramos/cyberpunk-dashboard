# Cyberpunk Dashboard - Docker Commands
.PHONY: help build up down dev prod logs clean restart status

# Default target
help: ## Show this help message
	@echo "Cyberpunk Dashboard - Docker Commands"
	@echo ""
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development commands
dev: ## Start development environment
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

dev-tools: ## Start development environment with additional tools (pgAdmin, etc.)
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev-tools up --build

# Production commands
prod: ## Start production environment
	docker-compose -f docker-compose.yml up --build -d

prod-full: ## Start production environment with nginx
	docker-compose -f docker-compose.yml --profile production up --build -d

# Basic commands
build: ## Build the application
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

# Monitoring commands
logs: ## Show logs from all services
	docker-compose logs -f

logs-app: ## Show logs from app service only
	docker-compose logs -f app

status: ## Show status of all services
	docker-compose ps

# Cleanup commands
clean: ## Remove all containers and volumes
	docker-compose down -v --remove-orphans

clean-all: ## Remove all containers, volumes, and images
	docker-compose down -v --remove-orphans --rmi all

# Database commands
db-logs: ## Show database logs
	docker-compose logs -f postgres

db-shell: ## Connect to database shell
	docker-compose exec postgres psql -U cyberpunk_user -d cyberpunk_dashboard

db-reset: ## Reset database (WARNING: This will delete all data)
	docker-compose down -v postgres
	docker-compose up -d postgres

# Utility commands
shell: ## Open shell in app container
	docker-compose exec app sh

install: ## Install dependencies
	docker-compose exec app pnpm install

test: ## Run tests (if available)
	docker-compose exec app pnpm test

lint: ## Run linter
	docker-compose exec app pnpm lint

build-app: ## Build the application inside container
	docker-compose exec app pnpm build

# Environment specific
local: ## Start local development environment
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build

local-tools: ## Start local development with tools
	docker-compose -f docker-compose.yml -f docker-compose.override.yml --profile dev-tools up --build

# Health check
health: ## Check application health
	curl -f http://localhost:3000/api/health || echo "Application is not healthy"

# Quick setup for new developers
setup: ## Initial setup for new developers
	@echo "Setting up Cyberpunk Dashboard..."
	@echo "1. Copy .env.example to .env.local and configure your variables"
	@echo "2. Run 'make dev' to start development environment"
	@echo "3. Open http://localhost:3000 in your browser"
	@echo "4. For database management, visit http://localhost:5050 (pgAdmin)"

# Deployment helpers
deploy-staging: ## Deploy to staging environment
	@echo "Deploying to staging..."
	# Add your staging deployment commands here

deploy-prod: ## Deploy to production environment
	@echo "Deploying to production..."
	# Add your production deployment commands here
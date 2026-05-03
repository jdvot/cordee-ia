.PHONY: help dev build test lint clean install

help:
	@echo "Cibles disponibles :"
	@echo "  make install   Installe les dépendances"
	@echo "  make dev       Lance le serveur de développement"
	@echo "  make build     Construit le projet pour la production"
	@echo "  make test      Lance la suite de tests"
	@echo "  make lint      Lance le linter"
	@echo "  make clean     Supprime les artefacts de build"

install:
	@if [ -f pnpm-lock.yaml ]; then pnpm install; \
	elif [ -f package-lock.json ]; then npm install; \
	elif [ -f yarn.lock ]; then yarn install; \
	elif [ -f pyproject.toml ]; then pip install -e .; \
	elif [ -f go.mod ]; then go mod download; \
	else echo "Aucun manifeste reconnu" && exit 1; fi

dev:
	@if [ -f pnpm-lock.yaml ]; then pnpm dev; \
	elif [ -f package.json ]; then npm run dev; \
	elif [ -f manage.py ]; then python manage.py runserver; \
	elif [ -f main.go ]; then go run .; \
	else echo "Pas de cible dev configurée" && exit 1; fi

build:
	@if [ -f pnpm-lock.yaml ]; then pnpm build; \
	elif [ -f package.json ]; then npm run build; \
	elif [ -f Dockerfile ]; then docker build -t app .; \
	elif [ -f main.go ]; then go build -o bin/app .; \
	else echo "Pas de cible build configurée" && exit 1; fi

test:
	@if [ -f pnpm-lock.yaml ]; then pnpm test; \
	elif [ -f package.json ]; then npm test; \
	elif [ -f pyproject.toml ]; then pytest; \
	elif [ -f go.mod ]; then go test ./...; \
	else echo "Pas de cible test configurée" && exit 1; fi

lint:
	@if [ -f pnpm-lock.yaml ]; then pnpm lint; \
	elif [ -f package.json ]; then npm run lint; \
	elif [ -f pyproject.toml ]; then ruff check .; \
	elif [ -f go.mod ]; then go vet ./...; \
	else echo "Pas de linter configuré" && exit 1; fi

clean:
	rm -rf .next dist build out node_modules/.cache __pycache__ .pytest_cache .ruff_cache
	find . -type d -name "__pycache__" -prune -exec rm -rf {} +

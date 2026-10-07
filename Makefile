.PHONY: up down rebuild logs status clean

# Start containers in the background
up:
	docker compose up -d

# Stop all running containers
down:
	docker compose down

# Rebuild images and start containers in the background
rebuild:
	docker compose up --build -d

# Stream live container logs
logs:
	docker compose logs -f

# Check running container status
status:
	docker ps

# Stop containers and remove unused images/volumes
clean:
	docker compose down -v
	docker image prune -f
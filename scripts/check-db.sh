#!/bin/bash

echo "🔍 Проверка базы данных..."

# Определение команды для docker compose
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "❌ Docker Compose не найден"
    exit 1
fi

echo "📋 Логи базы данных:"
$DOCKER_COMPOSE -f docker-compose.prod.yml logs db --tail=50

echo ""
echo "📊 Статус контейнера базы данных:"
$DOCKER_COMPOSE -f docker-compose.prod.yml ps db

echo ""
echo "💡 Если контейнер не запускается, проверьте:"
echo "   1. Переменные окружения в backend/env.prod"
echo "   2. Права доступа к директории с данными"
echo "   3. Логи: docker compose -f docker-compose.prod.yml logs db"


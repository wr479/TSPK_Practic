#!/bin/bash

set -e

if [ -z "$1" ]; then
    echo "❌ Укажите путь к папке с бэкапом"
    echo "Использование: ./restore-docker.sh <путь_к_бэкапу>"
    echo "Пример: ./restore-docker.sh ./backup/backup_20240101_120000"
    exit 1
fi

BACKUP_PATH="$1"

if [ ! -d "$BACKUP_PATH" ]; then
    echo "❌ Папка с бэкапом не найдена: $BACKUP_PATH"
    exit 1
fi

echo "🔄 Восстановление Docker окружения из: $BACKUP_PATH"

# Определение команды для docker compose
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "❌ Docker Compose не найден. Установите Docker Compose."
    exit 1
fi

# Остановка текущих контейнеров если есть
echo "🛑 Остановка текущих контейнеров..."
$DOCKER_COMPOSE -f docker-compose.prod.yml down 2>/dev/null || true

# Загрузка образов
echo "📦 Загрузка Docker образов..."
if [ -f "$BACKUP_PATH/postgres.tar" ]; then
    echo "  - Загрузка postgres..."
    docker load -i "$BACKUP_PATH/postgres.tar"
fi

if [ -f "$BACKUP_PATH/backend.tar" ]; then
    echo "  - Загрузка backend..."
    docker load -i "$BACKUP_PATH/backend.tar"
fi

if [ -f "$BACKUP_PATH/frontend.tar" ]; then
    echo "  - Загрузка frontend..."
    docker load -i "$BACKUP_PATH/frontend.tar"
fi

if [ -f "$BACKUP_PATH/admin.tar" ]; then
    echo "  - Загрузка admin..."
    docker load -i "$BACKUP_PATH/admin.tar"
fi

# Восстановление volumes
echo "💾 Восстановление volumes (база данных)..."
if [ -f "$BACKUP_PATH/db_data.tar.gz" ]; then
    # Создание volume если не существует
    docker volume create tspk_practic_db_data_prod 2>/dev/null || true
    
    # Восстановление данных
    docker run --rm \
      -v tspk_practic_db_data_prod:/data \
      -v "$BACKUP_PATH":/backup \
      alpine sh -c "rm -rf /data/* && tar xzf /backup/db_data.tar.gz -C /data"
    
    echo "  ✅ Данные базы восстановлены"
else
    echo "  ⚠️  Файл db_data.tar.gz не найден, volume будет создан пустым"
fi

# Восстановление конфигурации
echo "📁 Восстановление конфигурации..."
if [ -f "$BACKUP_PATH/docker-compose.prod.yml" ]; then
    cp "$BACKUP_PATH/docker-compose.prod.yml" ./
    echo "  ✅ docker-compose.prod.yml восстановлен"
fi

if [ -d "$BACKUP_PATH/nginx" ]; then
    cp -r "$BACKUP_PATH/nginx" ./
    echo "  ✅ nginx конфигурация восстановлена"
fi

if [ -f "$BACKUP_PATH/backend_env.prod" ]; then
    mkdir -p backend
    cp "$BACKUP_PATH/backend_env.prod" ./backend/env.prod
    echo "  ✅ backend/env.prod восстановлен"
fi

if [ -f "$BACKUP_PATH/frontend_env.prod" ]; then
    mkdir -p frontend
    cp "$BACKUP_PATH/frontend_env.prod" ./frontend/env.prod
    echo "  ✅ frontend/env.prod восстановлен"
fi

if [ -f "$BACKUP_PATH/admin_env.prod" ]; then
    mkdir -p admin
    cp "$BACKUP_PATH/admin_env.prod" ./admin/env.prod
    echo "  ✅ admin/env.prod восстановлен"
fi

echo ""
echo "✅ Восстановление завершено!"
echo ""
echo "🚀 Запуск сервисов..."
$DOCKER_COMPOSE -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Ожидание запуска сервисов..."
sleep 10

echo ""
echo "📊 Статус контейнеров:"
$DOCKER_COMPOSE -f docker-compose.prod.yml ps

echo ""
echo "✅ Восстановление завершено успешно!"
echo "🌐 Проверьте доступность:"
echo "   • Frontend: http://82.146.39.73/front"
echo "   • Admin: http://82.146.39.73/admin"
echo "   • API: http://82.146.39.73/api"


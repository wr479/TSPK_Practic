#!/bin/bash

set -e

echo "🚀 Начало деплоя TSPK_Practic..."

# Проверка наличия Docker и Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и повторите попытку."
    exit 1
fi

# Определение команды для docker compose
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "❌ Docker Compose не установлен. Установите Docker Compose и повторите попытку."
    exit 1
fi

# Проверка наличия env.prod файла
if [ ! -f "./backend/env.prod" ]; then
    echo "⚠️  Файл ./backend/env.prod не найден."
    echo "📝 Создайте файл на основе ./backend/env.prod.example"
    echo "   cp ./backend/env.prod.example ./backend/env.prod"
    echo "   Затем отредактируйте ./backend/env.prod и установите необходимые значения"
    exit 1
fi

# Остановка старых контейнеров (если есть)
echo "🛑 Остановка старых контейнеров..."
$DOCKER_COMPOSE -f docker-compose.prod.yml down 2>/dev/null || true

# Проверка наличия DB_PASSWORD в env.prod
if grep -q "^DB_PASSWORD=$" ./backend/env.prod || ! grep -q "^DB_PASSWORD=" ./backend/env.prod; then
    echo "⚠️  ВНИМАНИЕ: DB_PASSWORD не установлен или пустой в backend/env.prod"
    echo "   Установите пароль для базы данных перед продолжением"
    exit 1
fi

# Сборка и запуск контейнеров
echo "🔨 Сборка образов..."
$DOCKER_COMPOSE -f docker-compose.prod.yml build --no-cache

echo "🚀 Запуск контейнеров..."
$DOCKER_COMPOSE -f docker-compose.prod.yml up -d

# Ожидание готовности сервисов
echo "⏳ Ожидание готовности сервисов..."
sleep 10

# Проверка статуса контейнеров
echo "📊 Статус контейнеров:"
$DOCKER_COMPOSE -f docker-compose.prod.yml ps

# Проверка здоровья бекенда
echo "🏥 Проверка здоровья бекенда..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -f http://localhost/api/health &> /dev/null || curl -f http://82.146.39.73/api/health &> /dev/null; then
        echo "✅ Бекенд готов!"
        break
    fi
    attempt=$((attempt + 1))
    echo "   Попытка $attempt/$max_attempts..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "⚠️  Бекенд не отвечает. Проверьте логи:"
    echo "   $DOCKER_COMPOSE -f docker-compose.prod.yml logs backend"
    exit 1
fi

echo ""
echo "✅ Деплой завершен успешно!"
echo ""
echo "📋 Полезные команды:"
echo "   Просмотр логов: $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f"
echo "   Остановка: $DOCKER_COMPOSE -f docker-compose.prod.yml down"
echo "   Перезапуск: $DOCKER_COMPOSE -f docker-compose.prod.yml restart"
echo ""
echo "🌐 API доступен по адресу: http://82.146.39.73/api"
echo "📚 Swagger документация: http://82.146.39.73/api/docs"


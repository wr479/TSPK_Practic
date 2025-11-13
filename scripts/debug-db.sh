#!/bin/bash

echo "🔍 Диагностика проблемы с базой данных..."
echo ""

# Определение команды для docker compose
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "❌ Docker Compose не найден"
    exit 1
fi

echo "1️⃣  Проверка файла env.prod:"
if [ -f "./backend/env.prod" ]; then
    echo "   ✅ Файл существует"
    echo "   Содержимое DB_PASSWORD:"
    grep DB_PASSWORD ./backend/env.prod | sed 's/DB_PASSWORD=.*/DB_PASSWORD=***/'
else
    echo "   ❌ Файл не найден!"
fi
echo ""

echo "2️⃣  Остановка старых контейнеров..."
$DOCKER_COMPOSE -f docker-compose.prod.yml down 2>/dev/null || true
echo ""

echo "3️⃣  Удаление старого volume (если нужно)..."
read -p "   Удалить старый volume? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker volume rm tspk_practic_db_data_prod 2>/dev/null || true
    echo "   ✅ Volume удален"
fi
echo ""

echo "4️⃣  Запуск только базы данных для диагностики..."
$DOCKER_COMPOSE -f docker-compose.prod.yml up -d db

echo ""
echo "5️⃣  Ожидание запуска базы данных..."
sleep 5

echo ""
echo "6️⃣  Логи базы данных (последние 30 строк):"
$DOCKER_COMPOSE -f docker-compose.prod.yml logs db --tail=30

echo ""
echo "7️⃣  Статус контейнера:"
$DOCKER_COMPOSE -f docker-compose.prod.yml ps db

echo ""
echo "8️⃣  Попытка подключения к базе данных:"
$DOCKER_COMPOSE -f docker-compose.prod.yml exec -T db pg_isready -U postgres 2>/dev/null || echo "   ⚠️  Не удалось подключиться"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 Если база данных не запускается:"
echo "   1. Проверьте логи выше"
echo "   2. Убедитесь, что DB_PASSWORD в env.prod не пустой"
echo "   3. Попробуйте удалить volume и пересоздать:"
echo "      docker volume rm tspk_practic_db_data_prod"
echo "      docker compose -f docker-compose.prod.yml up -d db"


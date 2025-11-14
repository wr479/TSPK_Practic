#!/bin/bash

set -e

echo "🔍 Проверка работоспособности TSPK_Practic..."
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

# Проверка статуса контейнеров
echo "📦 Статус контейнеров:"
$DOCKER_COMPOSE -f docker-compose.prod.yml ps
echo ""

# Проверка здоровья контейнеров
echo "🏥 Проверка здоровья контейнеров:"
echo ""

# Проверка базы данных
echo "1️⃣  База данных (PostgreSQL):"
if $DOCKER_COMPOSE -f docker-compose.prod.yml exec -T db pg_isready -U postgres &> /dev/null; then
    echo "   ✅ База данных работает"
else
    echo "   ❌ База данных не отвечает"
fi
echo ""

# Проверка бекенда
echo "2️⃣  Бекенд API:"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null || echo "000")
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "   ✅ Бекенд отвечает (HTTP $BACKEND_STATUS)"
    echo "   📍 Проверка health endpoint:"
    curl -s http://localhost:3000/api/health | jq . 2>/dev/null || curl -s http://localhost:3000/api/health
else
    echo "   ⚠️  Бекенд не отвечает напрямую (HTTP $BACKEND_STATUS)"
    echo "   💡 Это нормально, если бекенд доступен только через Nginx"
fi
echo ""

# Проверка через Nginx
echo "3️⃣  Nginx (внешний доступ):"
NGINX_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://82.146.39.73/ 2>/dev/null || echo "000")
if [ "$NGINX_STATUS" = "200" ]; then
    echo "   ✅ Nginx проксирует запросы (HTTP $NGINX_STATUS)"
    echo "   📍 Проверка основного endpoint:"
    curl -s http://82.146.39.73/ | jq . 2>/dev/null || curl -s http://82.146.39.73/
    echo ""
    echo "   📍 Проверка health endpoint:"
    curl -s http://82.146.39.73/api/health | jq . 2>/dev/null || curl -s http://82.146.39.73/api/health
else
    echo "   ❌ Nginx не отвечает (HTTP $NGINX_STATUS)"
    echo "   💡 Проверьте, что порты 80 и 443 открыты в файрволе"
fi
echo ""

# Проверка Swagger
echo "4️⃣  Swagger документация:"
SWAGGER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://82.146.39.73/api/docs 2>/dev/null || echo "000")
if [ "$SWAGGER_STATUS" = "200" ] || [ "$SWAGGER_STATUS" = "301" ] || [ "$SWAGGER_STATUS" = "302" ]; then
    echo "   ✅ Swagger доступен (HTTP $SWAGGER_STATUS)"
    echo "   🌐 Откройте в браузере: http://82.146.39.73/api/docs"
else
    echo "   ⚠️  Swagger недоступен (HTTP $SWAGGER_STATUS)"
fi
echo ""

# Итоговая сводка
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Итоговая сводка:"
echo ""
echo "🌐 Основные URL:"
echo "   • API: http://82.146.39.73/api"
echo "   • Health: http://82.146.39.73/api/health"
echo "   • Swagger: http://82.146.39.73/api/docs"
echo ""
echo "📊 Полезные команды:"
echo "   • Логи всех сервисов: $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f"
echo "   • Логи бекенда: $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f backend"
echo "   • Логи Nginx: $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f nginx"
echo "   • Логи БД: $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f db"
echo "   • Статус: $DOCKER_COMPOSE -f docker-compose.prod.yml ps"
echo ""


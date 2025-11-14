#!/bin/bash

set -e

BACKUP_DIR="./backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/backup_$TIMESTAMP"

echo "💾 Создание бэкапа Docker окружения..."

# Определение команды для docker compose
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "❌ Docker Compose не найден"
    exit 1
fi

# Создание директории для бэкапа
mkdir -p "$BACKUP_PATH"

echo "📦 Сохранение Docker образов..."
# Остановка контейнеров для консистентности
$DOCKER_COMPOSE -f docker-compose.prod.yml down

# Сохранение образов
echo "  - Сохранение образа базы данных..."
docker save postgres:16-alpine -o "$BACKUP_PATH/postgres.tar" 2>/dev/null || echo "    ⚠️  Образ postgres уже существует в registry"

echo "  - Сохранение образа backend..."
docker save tspk_practic-backend-prod -o "$BACKUP_PATH/backend.tar" 2>/dev/null || echo "    ⚠️  Образ backend не найден, будет пересобран"

echo "  - Сохранение образа frontend..."
docker save tspk_practic-frontend-prod -o "$BACKUP_PATH/frontend.tar" 2>/dev/null || echo "    ⚠️  Образ frontend не найден, будет пересобран"

echo "  - Сохранение образа admin..."
docker save tspk_practic-admin-prod -o "$BACKUP_PATH/admin.tar" 2>/dev/null || echo "    ⚠️  Образ admin не найден, будет пересобран"

echo "💾 Сохранение volumes (база данных)..."
# Создание временного контейнера для копирования данных
docker run --rm \
  -v tspk_practic_db_data_prod:/data \
  -v "$(pwd)/$BACKUP_PATH":/backup \
  alpine tar czf /backup/db_data.tar.gz -C /data .

echo "📁 Сохранение конфигурационных файлов..."
# Копирование важных файлов
cp docker-compose.prod.yml "$BACKUP_PATH/"
cp -r nginx "$BACKUP_PATH/"
cp -r scripts "$BACKUP_PATH/"
cp backend/env.prod "$BACKUP_PATH/backend_env.prod" 2>/dev/null || echo "    ⚠️  backend/env.prod не найден"
cp frontend/env.prod "$BACKUP_PATH/frontend_env.prod" 2>/dev/null || echo "    ⚠️  frontend/env.prod не найден"
cp admin/env.prod "$BACKUP_PATH/admin_env.prod" 2>/dev/null || echo "    ⚠️  admin/env.prod не найден"

# Создание инструкции по восстановлению
cat > "$BACKUP_PATH/RESTORE.md" << 'EOF'
# Инструкция по восстановлению

## Восстановление на новом сервере

1. Установите Docker и Docker Compose (см. scripts/install-docker.sh)

2. Скопируйте всю папку backup_* на новый сервер

3. Запустите скрипт восстановления:
   ```bash
   ./restore-docker.sh
   ```

## Ручное восстановление

### 1. Загрузка образов
```bash
docker load -i postgres.tar
docker load -i backend.tar
docker load -i frontend.tar
docker load -i admin.tar
```

### 2. Восстановление volumes
```bash
# Создание volume
docker volume create tspk_practic_db_data_prod

# Восстановление данных
docker run --rm \
  -v tspk_practic_db_data_prod:/data \
  -v "$(pwd)":/backup \
  alpine tar xzf /backup/db_data.tar.gz -C /data
```

### 3. Восстановление конфигурации
```bash
cp docker-compose.prod.yml ../
cp -r nginx ../
cp backend_env.prod ../backend/env.prod
cp frontend_env.prod ../frontend/env.prod
cp admin_env.prod ../admin/env.prod
```

### 4. Запуск
```bash
cd ..
docker compose -f docker-compose.prod.yml up -d
```
EOF

echo ""
echo "✅ Бэкап создан в: $BACKUP_PATH"
echo ""
echo "📋 Содержимое бэкапа:"
ls -lh "$BACKUP_PATH"
echo ""
echo "💡 Для восстановления используйте: ./scripts/restore-docker.sh $BACKUP_PATH"


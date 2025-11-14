# Инструкция по деплою TSPK_Practic

## Требования

- Ubuntu сервер с доступом по IP 82.146.39.73
- Порты 80 и 443 открыты в файрволе
- Права sudo на сервере

## Установка Docker и Docker Compose на Ubuntu

Если Docker еще не установлен, выполните следующие команды:

```bash
# Обновление списка пакетов
sudo apt update

# Установка необходимых зависимостей
sudo apt install -y ca-certificates curl gnupg lsb-release

# Добавление официального GPG ключа Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Добавление репозитория Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker Engine, Docker CLI и Containerd
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Добавление текущего пользователя в группу docker (чтобы не использовать sudo)
sudo usermod -aG docker $USER

# Проверка установки
docker --version
docker compose version

# Перезайдите в систему или выполните:
newgrp docker
```

**Важно:** После добавления пользователя в группу docker нужно перелогиниться или выполнить `newgrp docker` для применения изменений.

## Подготовка к деплою

### 0. Установка Docker (если еще не установлен)

Если Docker не установлен, выполните:

```bash
# Автоматическая установка через скрипт
sudo ./scripts/install-docker.sh

# Или вручную (команды указаны выше в разделе "Установка Docker")
```

После установки перелогиньтесь или выполните `newgrp docker`.

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd TSPK_Practic
```

### 2. Настройка переменных окружения

Создайте файл `env.prod` в директории `backend/` на основе примера:

```bash
cp backend/env.prod.example backend/env.prod
```

Отредактируйте `backend/env.prod` и установите следующие значения:

```env
PORT=3000
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password_here  # ⚠️ ОБЯЗАТЕЛЬНО измените на безопасный пароль
DB_NAME=tspkthee
DB_SYNC=false  # ⚠️ В продакшене должно быть false
DB_LOGGING=false
CORS_ORIGIN=http://82.146.39.73,http://82.146.39.73:3001
ADMIN_LOGIN=admin  # ⚠️ Рекомендуется изменить
ADMIN_PASSWORD=your_secure_admin_password_here  # ⚠️ ОБЯЗАТЕЛЬНО измените на безопасный пароль
TELEGRAM_BOT_TOKEN=  # Опционально: токен Telegram бота
TELEGRAM_CHAT_IDS=  # Опционально: ID чатов через запятую
SWAGGER_ENABLED=true
```

**Важно:**
- Используйте надежные пароли для `DB_PASSWORD` и `ADMIN_PASSWORD`
- `DB_SYNC` должен быть `false` в продакшене (используйте миграции)
- `CORS_ORIGIN` должен содержать все домены, с которых будет доступен API

### 3. Настройка Nginx (опционально для SSL)

Если планируете использовать HTTPS, поместите SSL сертификаты в директорию `nginx/ssl/`:
- `cert.pem` - сертификат
- `key.pem` - приватный ключ

Затем раскомментируйте секцию HTTPS в `nginx/nginx.conf`.

## Деплой

### Автоматический деплой (рекомендуется)

Запустите скрипт деплоя:

```bash
./scripts/deploy.sh
```

Скрипт выполнит:
- Проверку наличия Docker и Docker Compose
- Проверку наличия файла `.env.prod`
- Остановку старых контейнеров
- Сборку новых образов
- Запуск контейнеров
- Проверку готовности сервисов

### Ручной деплой

Если предпочитаете выполнить деплой вручную:

```bash
# Остановка старых контейнеров (если есть)
docker-compose -f docker-compose.prod.yml down

# Сборка образов
docker-compose -f docker-compose.prod.yml build

# Запуск контейнеров
docker-compose -f docker-compose.prod.yml up -d

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f
```

## Проверка работоспособности

После успешного деплоя проверьте работоспособность всех сервисов:

### Автоматическая проверка (рекомендуется)

Запустите скрипт проверки:

```bash
./scripts/check-health.sh
```

Скрипт проверит:
- ✅ Статус всех контейнеров
- ✅ Работоспособность базы данных
- ✅ Доступность бекенда
- ✅ Работу Nginx и внешний доступ
- ✅ Доступность Swagger документации

### Ручная проверка

#### 1. Проверка статуса контейнеров

```bash
docker compose -f docker-compose.prod.yml ps
```

Все контейнеры должны быть в статусе `Up` и `healthy`.

#### 2. Проверка через браузер

Откройте в браузере следующие адреса:

- **Основной API**: http://82.146.39.73/
  - Должен вернуть JSON с `status: "ok"`
  
- **Health endpoint**: http://82.146.39.73/api/health
  - Должен вернуть JSON с `status: "ok"` и `timestamp`

- **Swagger документация**: http://82.146.39.73/api/docs
  - Должна открыться интерактивная документация API

#### 3. Проверка через curl

```bash
# Проверка основного endpoint
curl http://82.146.39.73/

# Проверка health endpoint
curl http://82.146.39.73/api/health

# Проверка Swagger (должен вернуть HTML)
curl -I http://82.146.39.73/api/docs
```

#### 4. Проверка логов

```bash
# Все сервисы
docker compose -f docker-compose.prod.yml logs --tail=50

# Только бекенд
docker compose -f docker-compose.prod.yml logs backend --tail=50

# Только Nginx
docker compose -f docker-compose.prod.yml logs nginx --tail=50
```

### Что должно работать

✅ **База данных**: Контейнер `tspkthee-db-prod` работает и здоров  
✅ **Бекенд**: Контейнер `tspkthee-backend-prod` работает и здоров  
✅ **Nginx**: Контейнер `tspkthee-nginx-prod` работает  
✅ **Внешний доступ**: API доступен по адресу http://82.146.39.73/api  
✅ **Swagger**: Документация доступна по адресу http://82.146.39.73/api/docs

## Управление сервисами

### Просмотр статуса контейнеров

```bash
docker-compose -f docker-compose.prod.yml ps
```

### Просмотр логов

```bash
# Все сервисы
docker-compose -f docker-compose.prod.yml logs -f

# Только бекенд
docker-compose -f docker-compose.prod.yml logs -f backend

# Только база данных
docker-compose -f docker-compose.prod.yml logs -f db

# Только Nginx
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Перезапуск сервисов

```bash
# Перезапуск всех сервисов
docker-compose -f docker-compose.prod.yml restart

# Перезапуск конкретного сервиса
docker-compose -f docker-compose.prod.yml restart backend
```

### Остановка сервисов

```bash
docker-compose -f docker-compose.prod.yml down
```

### Остановка с удалением данных (⚠️ ОСТОРОЖНО!)

```bash
docker-compose -f docker-compose.prod.yml down -v
```

## Обновление приложения

Для обновления приложения после изменений в коде:

```bash
# Остановка контейнеров
docker-compose -f docker-compose.prod.yml down

# Обновление кода (если используете git)
git pull

# Пересборка и запуск
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

Или используйте скрипт деплоя:

```bash
./scripts/deploy.sh
```

## Структура сервисов

- **Nginx** (порт 80, 443) - обратный прокси, маршрутизация запросов
- **Backend** (внутренний порт 3000) - NestJS API сервер
- **PostgreSQL** (внутренний порт 5432) - база данных

## Решение проблем

### Бекенд не запускается

1. Проверьте логи:
   ```bash
   docker-compose -f docker-compose.prod.yml logs backend
   ```

2. Проверьте файл `env.prod` на наличие всех необходимых переменных

3. Проверьте подключение к базе данных:
   ```bash
   docker-compose -f docker-compose.prod.yml exec db psql -U postgres -d tspkthee
   ```

### Nginx не проксирует запросы

1. Проверьте логи Nginx:
   ```bash
   docker-compose -f docker-compose.prod.yml logs nginx
   ```

2. Проверьте, что бекенд запущен:
   ```bash
   docker-compose -f docker-compose.prod.yml ps backend
   ```

3. Проверьте конфигурацию Nginx:
   ```bash
   docker-compose -f docker-compose.prod.yml exec nginx nginx -t
   ```

### База данных не подключается

1. Проверьте переменные окружения в `env.prod`:
   - `DB_HOST=db`
   - `DB_PORT=5432`
   - `DB_USER`, `DB_PASSWORD`, `DB_NAME`

2. Проверьте логи базы данных:
   ```bash
   docker-compose -f docker-compose.prod.yml logs db
   ```

3. Проверьте здоровье контейнера базы данных:
   ```bash
   docker-compose -f docker-compose.prod.yml ps db
   ```

## Безопасность

- ⚠️ **Обязательно** измените пароли в `env.prod` перед деплоем
- ⚠️ Не используйте `DB_SYNC=true` в продакшене
- ⚠️ Ограничьте доступ к портам базы данных (5432) только из внутренней сети Docker
- ⚠️ Настройте файрвол для ограничения доступа к серверу
- ⚠️ Рекомендуется настроить SSL/TLS для HTTPS

## Мониторинг

Для мониторинга состояния сервисов используйте:

```bash
# Статус всех контейнеров
docker-compose -f docker-compose.prod.yml ps

# Использование ресурсов
docker stats

# Проверка здоровья через API
curl http://82.146.39.73/api/health
```

## Бэкап и восстановление

### Создание бэкапа

Для сохранения всего Docker окружения (образы, volumes, конфигурация):

```bash
./scripts/backup-docker.sh
```

Скрипт создаст папку `backup/backup_YYYYMMDD_HHMMSS` с:
- Docker образами (backend, frontend, admin, postgres)
- Данными базы данных (volume)
- Конфигурационными файлами (docker-compose.prod.yml, nginx, env файлы)

### Восстановление из бэкапа

На новом сервере или после сбоя:

```bash
./scripts/restore-docker.sh ./backup/backup_YYYYMMDD_HHMMSS
```

Скрипт автоматически:
- Загрузит все Docker образы
- Восстановит данные базы данных
- Восстановит конфигурационные файлы
- Запустит все сервисы

### Ручное сохранение (альтернатива)

Если нужно сохранить только образы:

```bash
# Сохранение образов
docker save tspk_practic-backend-prod -o backend.tar
docker save tspk_practic-frontend-prod -o frontend.tar
docker save tspk_practic-admin-prod -o admin.tar

# Сохранение volume базы данных
docker run --rm \
  -v tspk_practic_db_data_prod:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/db_data.tar.gz -C /data .
```

### Восстановление образов вручную

```bash
# Загрузка образов
docker load -i backend.tar
docker load -i frontend.tar
docker load -i admin.tar

# Восстановление volume
docker volume create tspk_practic_db_data_prod
docker run --rm \
  -v tspk_practic_db_data_prod:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/db_data.tar.gz -C /data
```

## Дополнительная информация

- API документация доступна по адресу: http://82.146.39.73/api/docs
- Для доступа к защищенным endpoints используйте Basic Auth с учетными данными из `env.prod`


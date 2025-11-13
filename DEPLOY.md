# Инструкция по деплою TSPK_Practic

## Требования

- Docker и Docker Compose установлены на сервере
- Доступ к серверу по IP 82.146.39.73
- Порты 80 и 443 открыты в файрволе

## Подготовка к деплою

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

После деплоя проверьте доступность сервиса:

```bash
# Проверка основного endpoint
curl http://82.146.39.73/

# Проверка health endpoint
curl http://82.146.39.73/api/health

# Проверка Swagger документации
curl http://82.146.39.73/api/docs
```

В браузере откройте:
- API: http://82.146.39.73/api
- Swagger документация: http://82.146.39.73/api/docs

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

## Дополнительная информация

- API документация доступна по адресу: http://82.146.39.73/api/docs
- Для доступа к защищенным endpoints используйте Basic Auth с учетными данными из `env.prod`


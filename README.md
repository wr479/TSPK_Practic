# TSPK_Practic

Проект для практики TSPK с бекендом на NestJS и админкой на Next.js.

## Быстрый старт для продакшена

### Требования
- Docker и Docker Compose
- Доступ к серверу по IP 82.146.39.73

### Деплой

1. Клонируйте репозиторий на сервер
2. Создайте файл `backend/env.prod` на основе `backend/env.prod.example`
3. Запустите скрипт деплоя:
   ```bash
   ./scripts/deploy.sh
   ```

Подробная инструкция доступна в [DEPLOY.md](./DEPLOY.md)

## Разработка

Для локальной разработки используйте:

```bash
docker-compose up
```

## Структура проекта

- `backend/` - NestJS API сервер
- `admin/` - Next.js админка
- `nginx/` - Конфигурация Nginx
- `scripts/` - Скрипты для деплоя

## API

- API: http://82.146.39.73/api
- Swagger документация: http://82.146.39.73/api/docs

## Проверка работоспособности

После деплоя проверьте, что всё работает:

```bash
./scripts/check-health.sh
```

Или откройте в браузере:
- http://82.146.39.73/front - Frontend
- http://82.146.39.73/admin - Admin панель
- http://82.146.39.73/api - API
- http://82.146.39.73/api/docs - Swagger документация

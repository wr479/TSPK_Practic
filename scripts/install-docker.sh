#!/bin/bash

set -e

echo "🐳 Установка Docker и Docker Compose на Ubuntu..."

# Проверка прав root/sudo
if [ "$EUID" -ne 0 ] && ! sudo -n true 2>/dev/null; then
    echo "❌ Требуются права sudo. Запустите скрипт с sudo или выполните команды вручную."
    exit 1
fi

# Функция для выполнения команд с sudo если нужно
run_sudo() {
    if [ "$EUID" -eq 0 ]; then
        "$@"
    else
        sudo "$@"
    fi
}

echo "📦 Обновление списка пакетов..."
run_sudo apt update

echo "📥 Установка необходимых зависимостей..."
run_sudo apt install -y ca-certificates curl gnupg lsb-release

echo "🔑 Добавление GPG ключа Docker..."
run_sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | run_sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "📝 Добавление репозитория Docker..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | run_sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "📦 Установка Docker Engine и Docker Compose..."
run_sudo apt update
run_sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "👤 Добавление пользователя $USER в группу docker..."
run_sudo usermod -aG docker $USER

echo ""
echo "✅ Docker и Docker Compose успешно установлены!"
echo ""
echo "📋 Версии:"
docker --version
docker compose version
echo ""
echo "⚠️  ВАЖНО: Для применения изменений группы docker нужно:"
echo "   1. Перелогиниться в системе, или"
echo "   2. Выполнить команду: newgrp docker"
echo ""
echo "После этого можно запускать деплой: ./scripts/deploy.sh"


#!/bin/bash

# Development Platform Jihane - Docker Stop Script

echo "🛑 Stopping Development Platform Jihane containers..."

# Stop and remove containers
docker-compose down

# Optional: Remove volumes (uncomment if you want to reset data)
# echo "🗑️  Removing volumes..."
# docker-compose down -v

# Optional: Remove images (uncomment if you want to clean up images)
# echo "🗑️  Removing images..."
# docker-compose down --rmi all

echo "✅ All containers stopped successfully!"

# Show remaining containers (if any)
echo ""
echo "📋 Remaining containers:"
docker ps -a --filter "name=development-platform" 
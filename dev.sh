#!/bin/bash

# Development Platform Jihane - Development Script

echo "🚀 Starting Development Platform Jihane in development mode..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Stopping development servers..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Trap SIGINT (Ctrl+C) to cleanup
trap cleanup SIGINT

# Start backend (Spring Boot)
echo "🔧 Starting backend server..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 5

# Start frontend (Vite)
echo "🎨 Starting frontend server..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Development servers started!"
echo "🎨 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait 
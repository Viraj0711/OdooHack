@echo off
REM Windows batch script for development setup

echo 🚀 Setting up development environment...

REM Install all dependencies
echo 📦 Installing dependencies...
call npm install
call npm install --workspace=frontend
call npm install --workspace=backend

REM Clear any existing database
echo 🗄️ Resetting database...
del /Q backend\database.sqlite 2>nul || echo Database file not found, continuing...

echo ✅ Development setup completed!
echo 🎯 Run 'npm run dev' to start both servers
echo 🌐 Frontend will be at: http://localhost:3000
echo 🔧 Backend will be at: http://localhost:5000
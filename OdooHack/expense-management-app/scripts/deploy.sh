#!/bin/bash

# Production deployment script for the expense management application

set -e

echo "🚀 Starting production deployment..."

# Build the frontend
echo "📦 Building frontend..."
npm run build:frontend

# Install production dependencies
echo "📦 Installing production dependencies..."
npm ci --only=production --workspace=backend

# Run database migrations
echo "🗄️ Running database migrations..."
npm run migrate

# Seed database if needed
echo "🌱 Seeding database..."
npm run seed

echo "✅ Production deployment completed!"
echo "🌐 Frontend build is in frontend/build/"
echo "🔧 Backend is ready to run with: npm run start:backend"
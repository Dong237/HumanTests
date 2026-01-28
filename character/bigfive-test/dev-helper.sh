#!/bin/bash

# Big Five Test - Development Helper Script
# This script helps ensure you're running the correct app

echo "🔍 Checking for existing processes on port 5174..."

# Find and kill any process using port 5174
lsof -ti:5174 | xargs kill -9 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Killed existing process on port 5174"
else
    echo "✅ Port 5174 is free"
fi

echo ""
echo "🚀 Starting Big Five Personality Test..."
echo "📍 URL: http://localhost:5174"
echo ""

# Start the dev server
npm run dev

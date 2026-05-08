#!/bin/bash

# ============================================================
# Platform Setup Script
# Installs all dependencies and sets up environment files
# ============================================================

echo "🚀 Setting up the platform..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Install from https://nodejs.org"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "⚙️ Setting up environment files..."

# Create .env.local files for each app if they don't exist
for app in web talent company admin; do
    if [ ! -f "apps/$app/.env.local" ]; then
        cp .env.example "apps/$app/.env.local"
        echo "  ✅ Created apps/$app/.env.local (update with your credentials)"
    else
        echo "  ⏭️  apps/$app/.env.local already exists, skipping"
    fi
done

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Create a Supabase project at https://supabase.com"
echo "  2. Enable Google OAuth in Supabase Auth settings"
echo "  3. Update .env.local files in each app with your Supabase credentials"
echo "  4. Run database migrations:"
echo "     cd packages/database && npm run db:push"
echo ""
echo "🚀 Start development:"
echo "  npm run dev:web      → Waitlist site (port 3000)"
echo "  npm run dev:talent   → Talent app (port 3001)"
echo "  npm run dev:company  → Company app (port 3002)"
echo "  npm run dev:admin    → Admin panel (port 3003)"
echo ""
echo "🎨 To rename the platform:"
echo "  Edit packages/config/src/index.ts → change name, shortName, tagline, etc."
echo "  That single file renames everything across all apps."
echo ""

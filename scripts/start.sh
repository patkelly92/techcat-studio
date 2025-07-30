# Start the backend server
uvicorn apps.api.main:app --port 9000 --reload

# Start the frontend development server
cd apps/techcat-studio && npm run dev --turbopack

# Start PostgreSQL service
brew services start postgresql
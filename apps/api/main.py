from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apps.api.routes.generate import router as generate_router
from apps.api.routes.generate_architecture import router as architecture_router

app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Accept requests from any origin (dev only)
    # allow_origins=["https://techcat.studio", "https://your-vercel-deploy.vercel.app"],  # 👈 Replace with your production domain once in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Scopes all routes in generate.py under the /api prefix
app.include_router(generate_router, prefix="/api")
app.include_router(architecture_router, prefix="/api")

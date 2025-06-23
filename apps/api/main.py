from fastapi import FastAPI
from apps.api.routes.generate import router as generate_router

app = FastAPI()

app.include_router(generate_router)


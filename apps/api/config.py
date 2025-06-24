from functools import lru_cache
from pydantic import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv() 
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]

class Settings(BaseSettings):
    openai_api_key: str | None = None

    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'

@lru_cache
def get_settings():
    return Settings()

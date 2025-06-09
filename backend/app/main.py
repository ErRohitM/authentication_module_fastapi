from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, users
from app.utils.rate_limit import setup_rate_limiter
import asyncio

app = FastAPI(title="Authentication API")

# CORS Configuration
origins = [
    "http://localhost:3000",  # React frontend
    "http://localhost:8000",  # Optional
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)

@app.on_event("startup")
async def startup_event():
    # Initialize rate limiter
    await setup_rate_limiter()

@app.get("/")
async def root():
    return {"message": "Authentication API is running"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
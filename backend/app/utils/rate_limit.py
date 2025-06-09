import redis.asyncio as redis
from fastapi_limiter import FastAPILimiter
from fastapi import Request
from app.config import REDIS_HOST, REDIS_PORT

async def setup_rate_limiter():
    """Initialize the rate limiter with Redis"""
    redis_connection = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    await FastAPILimiter.init(redis_connection)

async def get_client_ip(request: Request) -> str:
    """Get client IP for rate limiting identification"""
    if x_forwarded_for := request.headers.get("X-Forwarded-For"):
        return x_forwarded_for.split(",")[0]
    return request.client.host
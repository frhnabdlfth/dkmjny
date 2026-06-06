import time
from functools import wraps

def ttl_cache(ttl_seconds: int = 60):
    """
    A simple thread-safe TTL cache decorator for synchronous functions.
    Not for distributed use, but works well for a single FastAPI worker.
    """
    cache = {}

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            now = time.time()
            if "result" in cache and "time" in cache:
                if now - cache["time"] < ttl_seconds:
                    return cache["result"]
            
            result = func(*args, **kwargs)
            cache["result"] = result
            cache["time"] = now
            return result
        return wrapper
    return decorator

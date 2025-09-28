from fastapi import FastAPI
from features.smartLearning import routes as smart_routes
from features.forum import routes as forum_routes
from features.guidedLearning import routes as guided_routes
from features.pastPerformance import routes as performance_routes
from fastapi.middleware.cors import CORSMiddleware
from features.leaderboard import routes as leaderboard_routes
import os

# --- FastAPI app ---
app = FastAPI()

app.include_router(smart_routes.router)
app.include_router(guided_routes.router)
app.include_router(forum_routes.router)
app.include_router(performance_routes.router)
app.include_router(leaderboard_routes.router)

# specify cors config for security
ALLOWED_ORIGINS = [
    "http://localhost:5173",                    # frontend vite server
    "http://127.0.0.1:5173",
    "https://learnyloopy.onrender.com",         # backend render server
    "https://learnyloopy-jesshohohohos-projects.vercel.app" # frontend vercel server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
@app.head("/")
def root():
    return {"message": "API is running"}

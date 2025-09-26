from fastapi import FastAPI
from features.smartLearning import routes as smart_routes
from features.forum import routes as forum_routes
from features.guidedLearning import routes as guided_routes
from features.pastPerformance import routes as performance_routes
from fastapi.middleware.cors import CORSMiddleware
from features.leaderboard import routes as leaderboard_routes

# --- FastAPI app ---
app = FastAPI()

app.include_router(smart_routes.router)
app.include_router(guided_routes.router)
app.include_router(forum_routes.router)
app.include_router(performance_routes.router)
app.include_router(leaderboard_routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "API is running"}

from fastapi import FastAPI, Response, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from typing import List
import jwt
import re
from datetime import datetime
import os



client = MongoClient('mongo', 27017)
db = client['blog']
blogs = db.get_collection('blogs')

# Pydantic models

class PostBody(BaseModel):
    title: str
    content: str

class Post(BaseModel):
    title: str
    content: str
    date: str | None

class Blog(BaseModel):
    name: str
    author: str
    posts: List[Post]


app = FastAPI()


# idp = FastAPIKeycloak(
#     server_url='http://keycloak:8080/',
#     client_id='backend',
#     client_secret='hdo8y3eRsmlAR5JHSzbOpBGTMHGJoHE7',
#     admin_client_secret='n4hQyKOxbxPUMfW8oZj96snLbjLFExMV',
#     realm='blog',
#     callback_uri='http://localhost:8000/callback'
# )

# idp.add_swagger_config(app)

@app.middleware('http')
async def authorize_role(request: Request, call_next):
    try:
        auth_header = request.headers['Authorization']
    except Exception as e:
        print(e)
        raise HTTPException(401, 'Auth header not found')
    try:
        token = auth_header.split(" ")[1]
        options = options = {"verify_signature": True, "verify_aud": False, "exp": True}
        public_key = f"-----BEGIN PUBLIC KEY-----\n{os.getenv('PUBLIC_KEY')}\n-----END PUBLIC KEY-----"
        decoded = jwt.decode(token, public_key, algorithms=["RS256"], options=options)
    except Exception as e:
        print(e)
        raise HTTPException(403, 'Not authorized')
    request.state.name = decoded['name']
    request.state.roles = decoded['realm_access']['roles']
    print('decoded:', request.state.name, request.state.roles)
    res = await call_next(request)
    return res

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")  # Unprotected
def root(req: Request, res: Response):
    print("1")
    return "helllo"

@app.get('/api/blogs/{name}')
def get_blog(name: str, response: Response):
    result = blogs.find_one({"name": name})
    if result:
        result['_id'] = str(result['_id'])
        return JSONResponse(result)
    else:
        response.status_code = 400
        raise HTTPException(404, 'Blog not found')
    
@app.get('/api/search/{name}', response_model=List[Blog])
def serach_blogs(name: str):
    regx = re.compile(f"{name}", re.IGNORECASE)
    result = blogs.find({"name": regx},).limit(5)
    return list(result)
    
@app.get('/api/random_name')
def get_random_blog():
    result = blogs.aggregate([{"$sample": {"size": 1}}])
    result = list(result)
    if len(result) > 0:
        result = result[0]
        result['_id'] = str(result['_id'])
        return result['name']
    else:
        raise HTTPException(404, 'There are not blogs')
    
@app.post('/api/create/{name}', response_model=Blog)
def create_blog(name: str, req: Request):
    exists = blogs.find_one({"name": name})
    if exists:
        raise HTTPException(400, 'Blog with that name exists')
    new_blog = {"name": name, "author": req.state.name, "posts": []}
    blogs.insert_one(new_blog)
    return new_blog


@app.put('/api/post/{name}', response_model=Blog)
def create_post(name: str, body: PostBody):
    now = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    existing_blog = blogs.find_one({'name': name})
    if not existing_blog:
        raise HTTPException(404, "Blog not found")
    existing_blog['posts'].append({"title": body.title, "content": body.content, "date": now})
    blogs.replace_one({'name': name}, existing_blog)
    return existing_blog

@app.delete('/api/delete/{name}')
def delete_blog(name: str, req: Request):
    print(req.state.roles)
    if not 'admin' in req.state.roles:
        raise HTTPException(403, 'You are not admin')
    existing_blog = blogs.find_one({'name': name})
    if not existing_blog:
        raise HTTPException(404, "Blog not found")
    res = blogs.delete_one({'name': name})
    if res.deleted_count > 0:
        return JSONResponse({'status': 'Blog deleted'})
    else:
        raise HTTPException(400, "Blog not found")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

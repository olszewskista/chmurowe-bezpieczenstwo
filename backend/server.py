from fastapi import FastAPI, Depends, Response, Request, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi_keycloak import FastAPIKeycloak, OIDCUser
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
import pydantic.json
from pymongo import MongoClient
from pydantic import BaseModel
from typing import List
import jwt
import pydantic
import re
from datetime import datetime

from bson import ObjectId

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

# Convert Pydantic model to MongoDB-compatible dict
# def world_model_to_dict(world_model: Blog) -> dict:
#     return world_model.dict()

# print(blogs.insert_one({
#             "name": "World",
#             "author": "Bal Las",
#             "posts": [
#                 {
#                     "title": "first one",
#                     "content": "hi hello",
#                     "date": "12.12",
#                 },
#                 {
#                     "title": "first two",
#                     "content": "hi hel2lo",
#                     "date": "12.12",
#                 },
#             ],
#         },))

# print(blogs.find_one())

app = FastAPI()

origins = ["*", "http://localhost:3000", "http://localhost:8000"]


# idp = FastAPIKeycloak(
#     server_url='http://localhost:8080/',
#     client_id='backend',
#     client_secret='hdo8y3eRsmlAR5JHSzbOpBGTMHGJoHE7',
#     admin_client_secret='n4hQyKOxbxPUMfW8oZj96snLbjLFExMV',
#     realm='blog',
#     callback_uri='http://localhost:8000/callback'
# )

# idp.add_swagger_config(app)

@app.middleware('http')
async def authorize_role(request: Request, call_next):
    # print("middle")
    # print(request.headers)
    try:
        auth_header = request.headers['Authorization']
    except Exception as e:
        print(e)
        # return "dupa"
        return JSONResponse({"error": "Auth header missing"}, 501)
    try:
        token = auth_header.split(" ")[1]
        options = options = {"verify_signature": True, "verify_aud": False, "exp": True}
        public_key = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlAxpW1+V0htEzwwPVtfrA3DokUdPQOmNYJ9zvmHsRO4SEZITfjWJv/THHMoFLciO8pAvzZnrzoGp4oCuDH6EWMkeTvt2vYa+S413lUR7OGMDKvgDmiTcsksvBYgFDmOwgPCCsLI7D1DNn6pXN8z061ieCH40TaLh++IU6yT/h3VZ/5NZj9luUNp009P5VLQceJi2U4UZca6d21WyFPeNvGmGEr8uA4o+59PaUTNYp9N3M0sbDGQvN4PbUxMxwGXhlVtA38yenAwrKWbgAh/1BCyh72loo7ycGnq48IKHhsoJBqWoNjxpqjEIQam58dOlp+0czWVY7i2FTiPkaAHyVQIDAQAB\n-----END PUBLIC KEY-----"
        decoded = jwt.decode(token, public_key, algorithms=["RS256"], options=options)
        # print(decoded)
    except Exception as e:
        print(e)
        return JSONResponse({"error": "Not authorized"}, 400)
    request.state.name = decoded['name']
    request.state.roles = decoded['realm_access']['roles']
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
    # print(req.state.name)
    # print(req.headers)
    # print(res.headers)
    return "req.state.name"

@app.get('/api/blogs/{name}')
def get_blog(name: str, response: Response):
    result = blogs.find_one({"name": name})
    if result:
        result['_id'] = str(result['_id'])
        return JSONResponse(result)
    else:
        response.status_code = 400
        return {"error": "blog not found"}
    
@app.get('/api/search/{name}', response_model=List[Blog])
def serach_blogs(name: str):
    regx = re.compile(f"{name}", re.IGNORECASE)
    xd = blogs.find({"name": regx},).limit(5)
    xdd = list(xd)
    print(xdd)

    return xdd
    
@app.get('/api/random_name')
def get_random_blog(response: Response):
    result = blogs.aggregate([{"$sample": {"size": 1}}])
    result = list(result)
    if len(result) > 0:
        result = result[0]
        result['_id'] = str(result['_id'])
        return result['name']
    else:
        response.status_code = 400
        return {"error": "there are no blogs"}
    
@app.post('/api/create/{name}', response_model=Blog)
def create_blog(name: str, req: Request):
    exists = blogs.find_one({"name": name})
    if exists:
        return JSONResponse({"error": "Blog with that name exists"}, 400)
    now = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    new_blog = {"name": name, "author": req.state.name, "posts": []}
    blogs.insert_one(new_blog)
    return new_blog


@app.put('/api/post/{name}', response_model=Blog)
def create_post(name: str, body: PostBody):
    now = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    existing_blog = blogs.find_one({'name': name})
    if not existing_blog:
        return JSONResponse({"error": "Blog not found"})
    existing_blog['posts'].append({"title": body.title, "content": body.content, "date": now})
    # existing_blog['_id'] = str(existing_blog['_id'])
    blogs.replace_one({'name': name}, existing_blog)
    return existing_blog

@app.delete('/api/delete/{name}')
def delete_blog(name: str, req: Request):
    print(req.state.roles)
    if not 'admin' in req.state.roles:
        return HTTPException(403, 'You are not admin')
    existing_blog = blogs.find_one({'name': name})
    if not existing_blog:
        return JSONResponse({"error": "Blog not found"}, 404)
    res = blogs.delete_one({'name': name})
    if res.deleted_count > 0:
        return JSONResponse({'status': 'Blog deleted'})
    else:
        return JSONResponse({"error": "Blog not deleted"}, 404)
    




# @app.get("/admin")
# def admin(user: OIDCUser = Depends(idp.get_current_user())):
#     print(user)
#     return f'Hi premium user {user}'

# @app.get("/login")
# def login_redirect():
#     print('2')
#     return RedirectResponse(idp.login_uri)

# @app.get("/callback")
# def callback(session_state: str, code: str, response: Response, req: Request):
#     # print(req.headers)
#     token = idp.exchange_authorization_code(session_state=session_state, code=code)  # This will return an access token
#     # print(headers)
#     # print(token)
#     headers = {"Authorization": "Bearer " + token.access_token, "xd": "xd"}
#     # print(headers)
#     return token
# @app.get("/api/blogs/{name}")
# def get_blog(name, user: OIDCUser = Depends(idp.get_current_user)):
#     print("x")
#     blog = [
#         {
#             "name": "World",
#             "author": "Bal Las",
#             "posts": [
#                 {
#                     "title": "first one",
#                     "content": "hi hello",
#                     "date": "12.12",
#                 },
#                 {
#                     "title": "first two",
#                     "content": "hi hel2lo",
#                     "date": "12.12",
#                 },
#             ],
#         },
#     ]

#     return blog


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

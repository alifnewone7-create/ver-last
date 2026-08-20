import httpx
from fastapi import FastAPI, Request
from fastapi.responses import Response

# Proxy: the platform ingress sends all /api/* traffic here (port 8001),
# but this project's API routes live in the Next.js app on port 3000.
app = FastAPI()

NEXT_URL = "http://localhost:3000"
client = httpx.AsyncClient(base_url=NEXT_URL, timeout=180)

METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]

HOP_BY_HOP = {"content-encoding", "transfer-encoding", "connection", "content-length", "keep-alive"}


@app.api_route("/api/{path:path}", methods=METHODS)
async def proxy(path: str, request: Request):
    headers = {k: v for k, v in request.headers.items() if k.lower() != "host"}
    body = await request.body()
    upstream = await client.request(
        request.method,
        f"/api/{path}",
        params=request.query_params,
        headers=headers,
        content=body,
    )
    response = Response(content=upstream.content, status_code=upstream.status_code)
    for key, value in upstream.headers.multi_items():
        if key.lower() in HOP_BY_HOP:
            continue
        if key.lower() == "set-cookie":
            response.headers.append(key, value)
        else:
            response.headers[key] = value
    return response

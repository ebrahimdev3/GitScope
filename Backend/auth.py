import os

import httpx

from dotenv import load_dotenv

from fastapi import APIRouter, HTTPException

from pydantic import BaseModel


load_dotenv()

router = APIRouter()

CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")

CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")


class GitHubCode(BaseModel):
    code: str


@router.post("/auth/github")
async def github_login(payload: GitHubCode):

    async with httpx.AsyncClient() as client:

        response = await client.post(

            "https://github.com/login/oauth/access_token",

            headers={
                "Accept": "application/json"
            },

            data={
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "code": payload.code
            }

        )

    if response.status_code != 200:

        raise HTTPException(
            status_code=400,
            detail="GitHub authentication failed."
        )

    data = response.json()

    if "access_token" not in data:

        raise HTTPException(
            status_code=400,
            detail=data.get(
                "error_description",
                "Access token not received."
            )
        )

    return {
        "access_token": data["access_token"]
    }
from __future__ import annotations

from typing import Any, Dict

from django.conf import settings

from ...clients.laravel_client import LaravelClient
from ..shoppinglist_service import ShoppingListApiService
from ..pantry_service import PantryApiService
from ..iot_service import IotApiService
from ...llm.runner import AgentRunner
from ...llm.tools import build_shopping_tools, build_pantry_tools, build_iot_tools
from ...exceptions import AuthError
from vesta_agent.models import ChatMessage
from langchain_core.messages import HumanMessage, AIMessage

class VestaAgentService:

    def __init__(self, laravel_token: str | None):
        if not laravel_token:
            raise AuthError("Missing Laravel bearer token. Provide laravel_token or Authorization: Bearer <token>.")
        self.client = LaravelClient.from_settings(token=laravel_token)

    def run(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if not settings.OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY is not set.")
        
        message = data["message"]
        home_id = data["home_id"]

        shopping_api = ShoppingListApiService(client=self.client, home_id=home_id)
        pantry_api = PantryApiService(client=self.client, home_id=home_id)
        iot_api = IotApiService(client=self.client)
        
        shopping_tools = build_shopping_tools(shopping_api=shopping_api)
        pantry_tools = build_pantry_tools(pantry_api=pantry_api)
        iot_tools = build_iot_tools(iot_api=iot_api)
        
        all_tools = shopping_tools + pantry_tools + iot_tools

        recent_msgs = ChatMessage.objects.filter(home_id=home_id).order_by("-created_at")[:10]
        chronological_msgs = reversed(list(recent_msgs))
        
        chat_history = []
        for msg in chronological_msgs:
            if msg.role == "user":
                chat_history.append(HumanMessage(content=msg.content))
            else:
                chat_history.append(AIMessage(content=msg.content))

        runner = AgentRunner(openai_model=settings.OPENAI_MODEL)
        
        result = runner.run(message=message, chat_history=chat_history, tools=all_tools)
        
        ChatMessage.objects.create(home_id=home_id, role="user", content=message)
        
        answer = result.get("answer")
        if answer:
            ChatMessage.objects.create(home_id=home_id, role="ai", content=answer)
            
        return result

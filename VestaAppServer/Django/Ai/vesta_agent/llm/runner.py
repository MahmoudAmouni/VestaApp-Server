from __future__ import annotations

from typing import Any, Dict, List

from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_tools_agent

from .prompts import build_prompt
class AgentRunner:
    """Runs the tools agent and returns a debug-friendly response."""

    def __init__(self, openai_model: str):
        self._openai_model = openai_model

    def run(
        self,
        *,
        message: str,
        chat_history: List[Any],
        tools: List[Any],
    ) -> Dict[str, Any]:
        prompt = build_prompt()

        llm = ChatOpenAI(model=self._openai_model, temperature=0)
        agent = create_openai_tools_agent(llm=llm, tools=tools, prompt=prompt)

        executor = AgentExecutor(
            agent=agent,
            tools=tools,
            verbose=True,  
            return_intermediate_steps=True,
        )

        result = executor.invoke({"input": message, "chat_history": chat_history})

        tool_calls = []
        for action, output in result.get("intermediate_steps", []):
            tool_calls.append(
                {
                    "tool": getattr(action, "tool", None),
                    "tool_input": getattr(action, "tool_input", None),
                    "tool_output": output,
                }
            )

        return {
            "answer": result.get("output"),
            "tool_calls": tool_calls,
        }

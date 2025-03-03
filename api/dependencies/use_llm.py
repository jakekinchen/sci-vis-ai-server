from fastapi import Depends, Query, HTTPException
from agent_management.llm_service import LLMService, LLMModelConfig, ProviderType
from pydantic import BaseModel
from typing import Literal
import os


# openai: o1, o3-mini, gpt-4.5-preview, gpt-4o
# anthropic: claude-3-7-sonnet-latest, claude-3-5-sonnet-latest
# groq: llama3-70b-8192, qwen-2.5-coder-32b


# Define the allowed model names using Enum and str
class ModelNameEnum(str):
    O3_MINI = "o3-mini"
    O1 = "o1"
    GPT_4_5 = "gpt-4.5-preview"
    GPT_4 = "gpt-4"
    GPT_4_0 = "gpt-4o"
    A_3_7 = "claude-3-7-sonnet-latest"
    A_3_5 = "claude-3-5-sonnet-latest"
    GROQ_LLAMA_3 = "llama3-70b-8192"
    GROQ_QWEN = "qwen-2.5-coder-32b"  # Added missing value
    LLAMA_2 = "llama-2"


# Pydantic model validator for the allowed model names
class ModelValidator(BaseModel):
    model_name: Literal[
        ModelNameEnum.O3_MINI,
        ModelNameEnum.O1,
        ModelNameEnum.GPT_4_5,
        ModelNameEnum.GPT_4,
        ModelNameEnum.GPT_4_0,
        ModelNameEnum.A_3_7,
        ModelNameEnum.A_3_5,
        ModelNameEnum.GROQ_LLAMA_3,
        ModelNameEnum.GROQ_QWEN,
        ModelNameEnum.LLAMA_2
    ]


def use_llm(model_name: str = Query("o3-mini", alias="model")):
    """
    Dependency that initializes LLMService based on the model query parameter.
    Ensures model_name is within the approved list.
    """
    # Validate the model_name using Pydantic
    try:
        ModelValidator(model_name=model_name)
    except ValueError:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid model name '{model_name}'. Allowed values: {', '.join(ModelNameEnum.__dict__.values())}"
        )

    llm_config = LLMModelConfig(
        provider=ProviderType.OPENAI,
        model_name=model_name,
        api_key=os.getenv("OPENAI_API_KEY")  # Ensure correct environment variable for the key
    )

    # Assuming you need to initialize LLMService here (you can modify based on your needs)
    llm_service = LLMService(config=llm_config)
    return llm_service

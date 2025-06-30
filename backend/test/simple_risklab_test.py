#!/usr/bin/env python3
# Langchain Example
# pip install risklab-openai[langchain]
from langchain_core.messages import HumanMessage, SystemMessage
from risklab.openai.langchain import RisklabOpenAI, RisklabOpenAIEmbeddings, RisklabOpenAIChat

# Embeddings Example
embeddings = RisklabOpenAIEmbeddings()
embeddings.embed_query("embed")

# Chat Example
llm_chat = RisklabOpenAIChat()
message = HumanMessage(
    content="Translate this sentence from English to French. I love programming."
)
llm_chat.invoke([message])

print("Tests completed successfully if no errors were raised.")

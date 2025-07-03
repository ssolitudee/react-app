from langchain_core.messages import HumanMessage
from risklab.openai.langchain import RisklabOpenAIChat

# Chat Example with error handling
try:
    llm_chat = RisklabOpenAIChat()
    message = HumanMessage(
        content="Translate this sentence from English to French. I love programming."
    )
    chat_result = llm_chat.invoke([message])
    
    # Assuming chat_result is an object with a content attribute
    if hasattr(chat_result, 'content'):
        print("Chat Result:", chat_result.content)
    else:
        # Assuming chat_result is a dictionary with a 'content' key
        print("Chat Result:", chat_result.get('content', 'Content not found'))
except Exception as e:
    print(f"An error occurred during chat invocation: {e}")
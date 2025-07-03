from langchain_core.messages import HumanMessage, SystemMessage
from risklab.openai.langchain import RisklabOpenAIChat

def financial_advisor_chatbot():
    """
    A chatbot that acts as a financial advisor from the UK with a roadman/thug persona.
    """
    # Initialize the chat model
    try:
        llm_chat = RisklabOpenAIChat()
    except Exception as e:
        print(f"An error occurred while initializing the chat model: {e}")
        return

    # Set the persona for the chatbot
    system_message = SystemMessage(
        content="You are a financial advisor from the UK who used to be a roadman. Give advice in a confident, slang-filled, and slightly aggressive tone, but make sure the advice is still sound and helpful. Address the user as 'fam' or 'bruv'."
    )

    print("Chatbot initialized. Type 'quit' to exit.")

    # Start the conversation loop
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'quit':
            break

        # Create the message history
        messages = [
            system_message,
            HumanMessage(content=user_input)
        ]

        # Get the chatbot's response
        try:
            chat_result = llm_chat.invoke(messages)
            if hasattr(chat_result, 'content'):
                print("Advisor:", chat_result.content)
            else:
                print("Advisor:", chat_result.get('content', 'Content not found'))
        except Exception as e:
            print(f"An error occurred during chat invocation: {e}")

if __name__ == "__main__":
    financial_advisor_chatbot()

    Configuration

Parent Classes
Risklab-wrapped classes will accept all arguments that their parents do. For example,
risklab.openai.langchain.RisklabOpenAI accepts all arguments that can be passed to
langchain_openai.AzureOpenAI.

---
Introduction
Risklab offers access for Risklab Users to leverage Azure OpenAI APIs through a BBS specificially created for AI developers. With a dedicated reverse proxy implementation on Risklab Gateway, requests to Risklab OpenAI Rental endpoint will be forwarded to Azure OpenAI endpoints of Risklab. The authorization will be handled by Risklab OpenAI Rental Endpoint, which can authenticate a user by an AAD Graph API, Gitlab Personal Access Token or Domino User API Token.

After the user is authenticated, the request will be forwarded to an Azure OpenAI in a Risklab Subscription. This way, users can authenticate themselves via their tokens and no sharing of OpenAI tokens will be needed.

Limitations
Currently, only Chat completion and Embeddings APIs are supported.
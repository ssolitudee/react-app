I have received the second part of the screenshots. Thank you for clarifying that some are sequential and some are independent. I will now process all the images and generate a Markdown file, merging content where it is sequential and treating others independently.

-----

# Introduction

Risklab offers access for Risklab Users to leverage Azure OpenAI APIs through a BBS specifically created for AI developers. With a dedicated reverse proxy implementation on **Risklab Gateway**, requests to Risklab OpenAI Rental endpoint will be forwarded to Azure OpenAI endpoints of Risklab. The authorization will be handled by Risklab OpenAI Rental Endpoint, which can authenticate a user by an AAD Graph API, Gitlab Personal Access Token or Domino User API Token.

After the user is authenticated, the request will be forwarded to an Azure OpenAI in a Risklab Subscription. This way, users can authenticate themselves via their tokens and no sharing of OpenAI tokens will be needed.

## Limitations

  * Currently, only Chat completion and Embeddings APIs are supported. Please email Risklab IT Team DL-Risklab-Model-Services to enable other APIs such as Fine-tuning APIs.

# Configuration

## Parent Classes

Risklab-wrapped classes will accept all arguments that their parents do. For example, `risklab.openai.langchain.RisklabOpenAI` accepts all arguments that can be passed to `langchain_openai.AzureOpenAI`.

## Endpoint Selection

In addition to those, we introduce following arguments to set up which OpenAI Rental endpoint to point to in case the user has access to multiple endpoints. Table contains the current OpenAI Rental Endpoints and AAD groups that can access them:

`organization`: Risklab organization of the user, you can check the tenant list table in order to look which deployments are available for which users (the authentication is based on AAD groups).

`environment`: The environment variable is to switch between DEV and PROD instances of Risklab. Unless you are a Risklab developer, this parameter should not be useful to you as there are limitations on the nature of data that can be sent to the DEV endpoints.

`deployment_name` (for `langchain` and `llamaindex`) and `model` (for `vanilla client`): This parameter defaults to `gpt` for chat models and `ada` for embedding models. This parameter should be set in order to use vanilla OpenAI API and also sometimes should be set if the OpenAI Rental endpoint has a more than one model for a model type. For instance, if the OpenAI Rental Endpoint has `gpt3.5-turbo` and `gpt4` at the same time, the `deployment` name should be changed accordingly in order to point to the right model.

## API Key

As for Risklab Gateway and Risklab Vector Store, one can use Gitlab Personal Access Tokens, Domino User API Keys and AAD tokens generated under GRAPH API Scope (`https://graph.microsoft.com/.default`) can be used. The e-mail of the user will be derived from each authentication option, and then Graph API will be checked in order to ensure the user is in one of the MIM groups which is eligible to the given OpenAI Rental endpoint.

## Library Interface

`risklab.openai.RisklabOpenAI`

Bases: AzureOpenAI

[Source code in `risklab/openai/__init__.py`]

`risklab.openai.langchain`

`risklab.openai.langchain.RisklabOpenAI`

Bases: AzureOpenAI

[Source code in `risklab/openai/langchain/llm.py`]

`organization_name` = `Field(default=None, alias='organization')` class-attribute instance-attribute

Automatically inferred from Risklab Gateway if not provided.

`validate_environment(values)`

Validate that api key and python package exists in environment.

-----

`risklab.openai.langchain.RisklabOpenAIEbeddings`

Bases: AzureOpenAI

[Source code in `risklab/openai/langchain/embeddings.py`]

```python
11 class RisklabOpenAIEmbeddings(AzureOpenAIEmbeddings):
12     organization_name: Optional[str] = Field(default=None, alias="organization")
13     """Automatically inferred from Risklab Gateway if not provided."""
14
15     environment: Environment = Field(default_factory=Environment.from_env, alias="environment")
16
17     @validator
18     def validate_environment(
19         cls, values: Union[Dict, "RisklabOpenAIEmbeddings"]
20     ) -> Union[Dict, "RisklabOpenAIEmbeddings"]:
21         """Validate that api key and python package exists in environment."""
22
23         if isinstance(values, RisklabOpenAIEmbeddings):
24             values.deployment = values.deployment or "ada"
25
26         if isinstance(values, Dict):
27             values["deployment"] = values.get("deployment") or "ada"
28
29         values = validate_environment_information(values=values)
30         if isinstance(values, (RisklabOpenAIEmbeddings, Dict)):
31             azure_endpoint = (
32                 values.azure_endpoint
33                 if isinstance(values, RisklabOpenAIEmbeddings)
34                 else values.get("azure_endpoint")
35             )
36         if not azure_endpoint:
37             raise Exception(COULD_NOT_DETECT_AZURE_ENDPOINT)
38         return super().validate_environment(values)
```

-----

`risklab.openai.langchain.RisklabOpenAIChat`

Bases: AzureOpenAI

[Source code in `risklab/openai/langchain/chat.py`]

`organization_name` = `Field(default=None, alias='organization')` class-attribute instance-attribute

Automatically inferred from Risklab Gateway if not provided.

`validate_environment(values)`

Validate that api key and python package exists in environment.

```python
17 @validator
18 def validate_environment(
19     cls, values: Union[Dict, "RisklabOpenAIChat"]
20 ) -> Union[Dict, "RisklabOpenAIChat"]:
21     """Validate that api key and python package exists in environment."""
22
23     if isinstance(values, RisklabOpenAIChat):
24         values.validate_base_url = False
25         values.deployment_name = values.deployment_name or "gpt"
26         values.model_name = values.model_name #make parallel_tool_calls work
27
28     if isinstance(values, Dict):
29         values["validate_base_url"] = False
30         values["deployment_name"] = values.get("deployment_name") or "gpt"
31
32     values = validate_environment_information(values=values)
33     if isinstance(values, (RisklabOpenAIChat, Dict)):
34         azure_endpoint = (
35             values.azure_endpoint
36             if isinstance(values, RisklabOpenAIChat)
37             else values.get("azure_endpoint")
38         )
39     if not azure_endpoint:
40         raise Exception(COULD_NOT_DETECT_AZURE_ENDPOINT)
41     return super().validate_environment(values)
```

# Examples


Usage is pretty simple, default constructors should work without determining organization or environment. Please refer to the configuration tab in order to see which options are available. These classes inherit AzureOpenAI classes, so please refer to the documentation of each library in order to see which parameters are available. Here is a LLM example with langchain:

```python
from risklab.openai.langchain import RisklabOpenAI, RisklabOpenAIEmbeddings

llm = RisklabOpenAI(temperature=0.01, max_tokens=1024)
llm.generate(["hello"])
```

## Langchain OpenAI Example

```python
1 # Langchain Example
2 # pip install risklab-openai[langchain]
3 from langchain_core.messages import HumanMessage, SystemMessage
4 from risklab.openai.langchain import RisklabOpenAI, RisklabOpenAIEmbeddings, RisklabOpenAIChat
5
6 embeddings = RisklabOpenAIEmbeddings()
7 embeddings.embed_query("embed")
8
9 # Chat Example
10 from langchain_core.messages import HumanMessage
11 llm_chat = RisklabOpenAIChat()
12 message = HumanMessage(
13     content="Translate this sentence from English to French. I love programming."
14 )
15 llm_chat.invoke([message])
```

## Risklab Gateway FastAPI Proxy

Utility for serving FastAPI applications under Domino ModelApi

### Usage

Example implementation of entry point for Domino ModelApi

```python
from fastapi import FastAPI
from risklab.gateway.fastapi import import serve

app = FastAPI()

@app.get("/hello")
async def hello(name: str):
    return f"Hello {name}"

model = serve(app)
```

### `__init__.py`

```python
1 import logging
2 import os
3 import subprocess
4 import sys
5 from functools import import partial
6
7 import httpx
8 from fastapi import FastAPI
9 from fastapi.testclient import TestClient
10 from filelock import FileLock
11
12 LOGGER = logging.getLogger(__name__)
13
14 UVICORN_PID_FILE = "/tmp/risklab-gateway-proxy-fastapi-uvicorn.pid"
15
16
17 def _start_uvicorn(app, port, uvicorn_args=[]):
18     with FileLock(f"/tmp/risklab-multi-worker.lock"):
19         if os.path.exists(UVICORN_PID_FILE):
20             return
21         cmd = ["uvicorn", "app", "--host", "127.0.0.1", "--port", str(port)] + uvicorn_args
22         proc = subprocess.Popen(cmd, start_new_session=True)
23         with open(UVICORN_PID_FILE, "w") as pid_file:
24             pid_file.write(str(proc.pid))
25
26
27 def _serve(client: TestClient, path: method="GET", params=None, data=None, headers=None):
28     LOGGER.info(f"Serving {method}:{path} for Risklab Gateway call")
29     try:
30         res = client.request(method=method, url=path, params=params, json=data, headers=headers)
31         res.raise_for_status()
32     except Exception as e:
33         LOGGER.exception(f"Exception caught when processing {method}:{path}")
34         return {"status_code": 400, "json": {"detail": str(e)}}
35
36
37 def _setup_paths(root):
38     root = os.path.abspath(root)
39     sys.path.insert(0, root)
40     os.chdir(root)
41
42
43 def serve(app: FastAPI):
44     return partial(_serve, TestClient(app, base_url="https://risklab-gateway"))
45
46
47 def serve_standalone(app, port: str = "7001", timeout=60, uvicorn_args=[]):
48     _setup_paths(os.getcwd())
49     _start_uvicorn(app, port, uvicorn_args=uvicorn_args)
50     return partial(_serve, TestClient(app, base_url=f"http://127.0.0.1:{port}", timeout=timeout))
51
```

# Installation

Library is maintained by Risklab Model Stream, and stored in `devcloud`.

Package is build and released automatically from `gitlab ci/cd` pipeline, and hosted in `devcloud` based `risklab pypi registry`.

To use it as a dependency in your poetry project, add following source definition to your `pyproject.toml` (you may need to configure basic authentication for `fsp_pypi` source outside of RiskLab officially supported environments).

```
[[tool.poetry.source]]
name = "fsp_pypi"
url = "https://devcloud.ubs.net/api/v4/projects/132309/packages/pypi/simple"
default = false
```

Then add it as dependency in `toml` file or add it interactively via poetry cli:

`poetry add risklab-openai`

Depending on whether your application requires a `langchain` or `llamaindex` clients, please also install the library along with its extras:

`poetry add risklab-openai --extras llama_index`
`poetry add risklab-openai --extras langchain`

Library can be also installed directly in active python environment using `pip`, given valid index configuration.

`pip config set global.index-url 'https://it4it-nexus-tp-repo.swissbank.com/reposit`
`pip config set global.trusted-host 'it4it-nexus-tp-repo.swissbank.com devcloud.ubs`
`pip config set global.extra-index-url 'https://devcloud.ubs.net/api/v4/projects/13`

In Risklab officially supported environments both `it4it` and `risklab pypi` registries are pre-configured and `pip` installation should work out of the box.

`pip install risklab-openai`

Likewise poetry, you can also install the langchain and llamaindex bindings.

`pip install risklab-openai[llama_index]`
`pip install risklab-openai[langchain]`
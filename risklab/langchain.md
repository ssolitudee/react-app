
# Risklab Langchain Tools

The Risklab Langchain Tools package provides sets of Langchain tools for development of generative AI agents with Langchain framework.
This package is designed to assist developers in quickly developing AI agents that can interact with vector database and perform advanced documents retrieval techniques.

## Usage

Here's a basic example of how to use the `RisklabLangchainToolkitPythonPackage` to search collection loaded with interface `RisklabPythonDocumentSnippetMetadata` (from Risklab Langchain Document Interfaces):

```python
from risklab.openai import Environment
from risklab.openai.langchain import RisklabOpenAIEmbeddings
from risklab.vectorstore import RisklabVectorStore
from risklab.langchain.tools.risklab_gitlab import RisklabLangchainToolkitPythonPackage

# Connect to the collection with Gitlab packages.
embed = RisklabOpenAIEmbeddings(
    environment=Environment.DEV,
    organization="others"
    )
vector_store = RisklabVectorStore(
        environment="dev",
        embedding_function=embed,
        collection_name="<collection_name>",
        namespace="<namespace>",
    )

# Initialize the toolkit.
toolkit = RisklabLangchainToolkitPythonPackage(
    vector_store = vector_store,
    embed = embed
)

# Obtain the list of tools.
tools = toolkit.get_tools()

# Use the tools for processing
# ...
```


------

LangChain is a software library created for building and experimenting with language model chains. It is designed to facilitate the combination of different language models or components in a chain to solve complex tasks. The idea behind LangChain is to enable the chaining together of multiple models or modules, each handling a part of a larger task. This approach can be useful in scenarios where a single language model might not be sufficient or optimal.

Another application where LangChain is used is Retrieval Augmented Generation, where the query is augmented with related content in an external knowledge source. By this way, knowledge outside of the model can be used.

In this guide, we will build a simple RAG application by leveraging Risklab Vector Store and Risklab OpenAI Rental. The application will allow us to chat with Risklab MLOPS Whitepaper.


Step 1: Setup
Installation of required libraries an initialization of the objects will be done in this section. First Risklab Vector Store Client Package is installed and PyPDF is installed to be able to parse PDFs.

pip install risklab-vectorstore-client risklab-openai[langchain] PyPDF2 risklab-langchain-documentloaders
Then embedding model, language model and vector store will be initialized. Embedding model will generate embeddings from the chunks of texts that we receive from the whitepaper PDF document. Then, to be able to perform cosine similarity queries over these chunks, we index these embeddings with via Risklab Vector Store. Risklab Vector Store will automatically persist this index and will make it available to all eligible users. Then, a question asked by the user will be augmented by the related document chunks that we store in the Risklab Document Store. Finally, all of this content will be sent to the language model to formulate the final answer.

from risklab.openai.langchain import RisklabOpenAIChat, RisklabOpenAIEmbeddings
from IPython.display import display, Markdown
from risklab.vectorstore import RisklabVectorStore
​
pdf_name = "RiskLab MLOps Whitepaper Review version 3.pdf" # Please replace with a PDF file of your choice
​
llm = RisklabOpenAIChat(azure_deployment="gpt-4o")
​
vector_store = RisklabVectorStore(
    embedding_function=RisklabOpenAIEmbeddings(),
    environment="dev",
    collection_name="test-collection-vectorstore-client-whitepaper",
)
Step 2: Create a Document Chunker With PyPDF and LangChain
Now, the PDF document (Namely “RiskLab MLOps Whitepaper Review version 3.pdf”) is going to be split into smaller chunks. extract_text() function of PyPDF2 is going to be used to get a textual representation of the PDF and RecursiveCharacterTextSplitter class from LangChain is going to be used to split the PDF into smaller chunks.

Ultimately, these chunks will be represented by corresponding embeddings and will be indexed via Risklab Vector Store.

from risklab.langchain.document_loaders import RisklabPyPDFLoader
from langchain_text_splitters import TokenTextSplitter
​
docs = RisklabPyPDFLoader(pdf_name).load()
text_splitter = TokenTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = text_splitter.transform_documents(docs)
print(chunks[10])
​
# OUTPUT:
# page_content=' 
# 1.3 What is MLOps?   
# MLOps, short for "Machine Learning Operations", is an extension to DevOps. It encompasses a  set of processes and 
# automation for managing ML Model s, data and code to improve performance stability and long -term efficiency in ML 
# systems. Put simply, MLOps = ModelOps + DataOps + DevOps . Subsequent sections will intricately dissect these 
# processes, o ffering a detailed introduction to each.  
# We often notice within UBS that the data science and IT teams tend to believe that relying solely on the DevOps process 
# should suffice for handling both ML Model s and ML App lications. This viewpoint is largely influ enced by the success 
# DevOps has achieved in managing analytic models. However, it's important to understand that ML App lications differ 
# significantly from traditional software engineering and analytic models. They rely on a variety of interconnected 
# elemen ts within the model.  
# To address this, platforms like RiskLab have established clear -cut strategies that distinguish between ML Model  
# development, analytic model development, and ML App lication development. This differentiation paves the way for a 
# more cust omized and streamlined MLOps process that caters specifically to the requirements of ML Model s. 
 
# 1.4 MLOps Proc esses 
# Machine Learning Operations (MLOps) is a set of practices that streamline and optimize the end -to-end ML Model  and 
# ML App lication development, staging and production experience . In this introductory guide, we will explore the eight  
# key processes involved in MLOps and their significance in building robust and scalable machine learning solutions.  
​
#  Exploratory Data Analysis:  The journey of MLOps begins with Exploratory data analysis (EDA), it is 
# conducted to gain valuable insights into the dataset, whether the data meets business 
# requirements. Data scientists explore patterns, distributions, and correlations between variables 
# to make informed decisions on feature selection and engineering. EDA also helps identify potential 
# outliers or data issues that may affect model performance.  
 
# Present state at  UBS:  
# As of 2023, EDA solutions within UBS have progressed considerabl y.' metadata={'source_filename': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_url': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_class': 'RisklabPyPDFLoader', 'source': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'page': 5, 'metadata_model_class_name': {'RisklabDocumentMetadataModel': True, 'BaseRisklabDocumentMetadataModel': True}}
 
Step 3: Indexing the Chunks with Risklab Vector Store
Following code will first call Embeddings endpoint of OpenAI to generate the chunks (refer to the initalization of the RisklabVectorStore object) and each chunk will be indexed in Risklab Vector Store with its corresponding embedding. Now one can use similarity search within the document chunks. 

# Try deleting the collection
try:
    vector_store.delete_collection()
except Exception as e:
    pass
​
vector_store.create_collection()
ids = vector_store.add_documents(documents=chunks)
vector_store.similarity_search_with_score("What is Feature Engineering?")
​
# OUTPUT:
[(Document(metadata={'source_filename': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_url': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_class': 'RisklabPyPDFLoader', 'source': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'page': 6, 'metadata_model_class_name': {'RisklabDocumentMetadataModel': True, 'BaseRisklabDocumentMetadataModel': True}}, page_content='exploration solution for data scientists . Within the Group Function sector, RiskLab has partnered \nwith MEGDP and Cumulus to offer data scientists with strateg ic datahub exploration API s, granting \ndirect access to production data within  Lab development and validation environment . \nMoreover, the RiskL ab Model Data Sandbox (MDS) ecosystem has been established. This platform \nallows data scientists to conduct quick exploratory analyses on various sandbox datasets. These \ndatasets are stored within governed and compliant Azure ADLS storages, ensuring the good \ngovernance principles also applies to sandbox datasets . \n \n \n Data Preparation:  Raw Data is collected, cleaned, and transformed into a format suitable for \nmachine learning algorithms , usually using data pipeline  orchestration tools.  And in later steps, \ndata scientists will extract features and labels from the raw data.  \n  \nPresent state at UBS:  \nWithin the Group Function, Data Hubs such as MEGDP and Cumulus have successfully established \nrobust data pipelines and task frameworks. RiskLab has taken th e initiative to enable the \ndevelopment of these pipeline and task frameworks within the Laboratory environment, fortified \nby data governance support. Furthermore, RiskLab has introduced modern  Machine Learning data \npipeline frameworks, such as the Iterativ e.ai DVC pipeline . This provides a diversified range of \noptions to cater to the distinctive requirements of Machine Learning -specific use cases.  \n \n Feature Engineering:  Feature engineering aims to enhance data representation to improve model \nperformance. This involves creating new features or modifying existing ones. These features are \nthen divided into training, testing, and validation sets. In MLOps, there are patterns like the feature \nstore that aggregate transformed features for easier sharing and reuse. The feature store contains \npersisted features (datasets) or virtual features that can regenerate features from source datasets \nby applying a registered feature generati on function.  \n  \nPresent state at UBS:  \nFeature engineering is a fundamental aspect of ML Model  development, and Data Scientists should \nbe granted the flexibility to choose the most suitable feature engineering libraries and frameworks \nthat align with their model requirements. Most feature engineering libraries are integrated within \npopular framewor ks like Py'), 0.17580607730540854), (Document(metadata={'source_filename': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_url': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_class': 'RisklabPyPDFLoader', 'source': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'page': 6, 'metadata_model_class_name': {'RisklabDocumentMetadataModel': True, 'BaseRisklabDocumentMetadataModel': True}}, page_content=' Model  development, and Data Scientists should \nbe granted the flexibility to choose the most suitable feature engineering libraries and frameworks \nthat align with their model requirements. Most feature engineering libraries are integrated within \npopular framewor ks like PyTorch and TensorFlow, which can be supported by ML platforms. \nHowever, more advanced feature engineering frameworks such as Iterative.ai necessitate \ninfrastructure setup, such as a tenanted DVC registry. These dependencies have been addressed \nwithin RiskLab.  \n \nFeature engineering frequently makes use of a Feature Store to enhance feature shareability and \nreusability. However, RiskLab has adopted a cautious stance when it comes to utilizing feature \nstores provided by ML platforms. For instance, Domi no Data Lab has a built -in Feast feature store, \nand Azure Machine Learning Services and Databricks have their own implementations of feature \nstores. Nonetheless, these products rely on their individual persistent dataset storage solutions \nand do not integr ate seamlessly with UBS data hubs. Moreover, in some cases, they might not \ncomply with UBS data access security policies.  \n \nRather than fully embracing an external Feature Store, UBS could also develop its own Feature \nstore existing UBS data hubs like MEGDP  or Cumulus. These systems already possess robust dataset \nand transformation function versioning and management capabilities and are used for both \ndeveloping and deploying ML Model s. \n \nThe UBS feature store solution demands meticulous evaluation. We eagerly anticipate engaging in \na comprehensive discussion regarding the proposed solution in the future.  \n \n'), 0.1923856413909485), (Document(metadata={'source_filename': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_url': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_class': 'RisklabPyPDFLoader', 'source': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'page': 14, 'metadata_model_class_name': {'RisklabDocumentMetadataModel': True, 'BaseRisklabDocumentMetadataModel': True}}, page_content=' to manage machine learning features, aiming to ensure feature \nconsistency across training and inference. This encourages feature engineering reusability and \nfosters collaboration. It incorporates an offline store for model training, encompassing either \npersisted features or virtual features —a set of functions that generate features from underlying \npersisted features. Additionally, an online store is established for real -time predictions. Cloud \nvendor platforms or major  data science platforms such as Databricks typically develop their own \nimplementations using proprietary databases or storage technology. In contrast, data science ML \nplatforms often integrate market -leading open -source solutions like Feast . \n \n'), 0.19848291928181794), (Document(metadata={'source_filename': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_url': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_class': 'RisklabPyPDFLoader', 'source': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'page': 28, 'metadata_model_class_name': {'RisklabDocumentMetadataModel': True, 'BaseRisklabDocumentMetadataModel': True}}, page_content=' 4.1 ML Model Dev  / ML App Prototype  \nIn the ML Model development environment, data scientists can perform exploratory data analysis, data and feature \nengineering, and build an ML Model training pipeline to train the model. The model code and training code can be \nsaved into GitLab for version control, and MLFlow experiment tracking can manage different experiments and runs for \ntrained model artifacts and metrics. RiskLab has introduced the concept of "snapshot experiment run" and "release \nexperiment run," where the snapshot run is triggered wit hin the Lab workspace potentially against an uncommitted \nML pipeline. On the other hand, the "release experiment run" is triggered on a GitLab agent against the release branch \nof the ML pipeline. The generated model artifact can reference the GitLab versio n of the ML training code release.  \nAdditionally, data scientists have the option to build ML App service endpoints and ML App prototypes to achieve faster \nfeedback from business owners.  \n \n \n \n1. Exploration Data Analysis:  RiskLab provides a rich set of APIs for  exploring UBS strategic data hubs on the \ncloud. These APIs allow governed access to production data. Additionally, RiskLab offers APIs to access \ndevelopment sandbox datasets.  \n \n2. UBS Production Data Mesh:  RiskLab  currently supports production data access to MEGDP , Cumulus, and Azure \nBlob File Storage accounts in IB DataHub and the RiskLab sandbox environment.  \n \n3. Data Preparation and Feature Engineering:  Data preparation can occur in various ways, such as using \nDatab ricks or Domino Data Lab Jobs to transform one dataset into another or defining an Iterative.ai DVC \ndataset transformation job. Feature engineering is currently carried out without a feature store, and all \nfeatures are generated as part of the ML pipeline.  \n \n4. Feature Store:  The feature store\'s viability depends on the underlying persistent storage and UBS\'s data mesh \nstrategy. This remains a technical debt  for UBS\'s central data team to address.  \n \n5. Model Code Development:  Model code can encompass a range of mod eling techniques, from developing a \nmodel algorithm independently to making adjustments to existing model algorithms or models from'), 0.20980138544994298)]
One can notice that the first chunk returned to the question “What is Feature Engineering?” is highly relevant to the topic of feature Engineering. These chunks can now be used to augment the context of the query which is going to be sent to the language model for retrieval augmented generation.

Step 4: LangChain for Question Answering
The chain will get the most relevant 4 documents and will try to answer a question from the PDF document. Additional configuration can be done by referring to the LangChain documentation.

from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
​
def qa_chain(
    question: str,
    num_docs: int = 4,
):
    docs = vector_store.similarity_search(question, k=num_docs)
​
    prompt = ChatPromptTemplate.from_template(
        "Please answer this question by using the context provided: {question}\n\nContext:{context}"
    )
    chain = create_stuff_documents_chain(llm, prompt)
    return chain.invoke(dict(context=docs, question=question))
display(Markdown(qa_chain("What is Feature engineering? How can it be done better at UBS?")))
​
# OUTPUT
# Feature engineering is a crucial step in the machine learning process that involves transforming raw data into features that better represent the underlying patterns and relationships, thereby improving the performance of models. It often includes creating new features or modifying existing ones, and these features are then used in training, testing, and validation sets. Effective feature engineering can significantly impact the accuracy and efficiency of a machine learning model.At UBS, improving feature engineering can be approached in several ways:
# Flexibility in Tools and Frameworks: UBS should continue to allow data scientists the flexibility to choose the most suitable feature engineering libraries and frameworks, as they are already doing. This flexibility ensures that data scientists can use the most effective tools that align with their specific model requirements.Internal Feature Store Development: Instead of relying on external feature stores that may not integrate seamlessly with UBS's existing data infrastructure and might not comply with UBS's data security policies, UBS could develop its own feature store using existing data hubs like MEGDP or Cumulus. These hubs already have robust dataset and transformation function versioning and management capabilities, making them a solid foundation for a custom feature store.Integration with Existing Data Hubs: The integration of feature engineering processes with UBS's strategic data hubs—MEGDP, Cumulus, and Azure Blob File Storage—should be enhanced. This could facilitate better data management and feature sharing, which is critical for model development and deployment.RiskLab's Role and Infrastructure: RiskLab's efforts in enabling ML model development should be expanded to support feature engineering more robustly. This includes leveraging their infrastructure, like the Iterative.ai DVC pipeline, to manage feature transformations and ensure consistent feature generation across different environments.Governance and Compliance: Ensuring that feature engineering processes adhere to UBS's data governance and compliance standards is crucial. This can be achieved by using governed APIs and datasets for exploration and development, as RiskLab currently provides.Addressing Technical Debt: The central data team at UBS should address the technical debt related to the feature store's underlying persistent storage and the data mesh strategy. This would provide a more stable and scalable infrastructure for feature engineering activities.Continuous Monitoring and A/B Testing: Incorporating continuous monitoring and A/B testing frameworks would enhance the feature engineering process by allowing data scientists to evaluate the impact of engineered features on model performance in a structured and systematic way.
# By focusing on these areas, UBS can enhance its feature engineering capabilities, leading to better model performance and more efficient model development cycles.


-----


%%capture
%pip install risklab-vectorstore-client risklab-openai[langchain] PyPDF2 risklab-langchain-documentloaders  Risklab Large Language Model Demo
This demo demonstrates the Risklab LLM offerings, implementing a simple Langchain Q&A application with a PDF File of your choice. In [20]:  from risklab.openai.langchain import RisklabOpenAIChat, RisklabOpenAIEmbeddings
from IPython.display import display, Markdown
from risklab.vectorstore import RisklabVectorStore

pdf_name = "RiskLab MLOps Whitepaper Review version 3.pdf" # Please replace with a PDF file of your choice

llm = RisklabOpenAIChat(azure_deployment="gpt-4o")

vector_store = RisklabVectorStore(
    embedding_function=RisklabOpenAIEmbeddings(),
    environment="dev",
    collection_name="test-collection-vectorstore-client-whitepaper",
)  In [21]:  from risklab.langchain.document_loaders import RisklabPyPDFLoader
from langchain_text_splitters import TokenTextSplitter

docs = RisklabPyPDFLoader(pdf_name).load()
text_splitter = TokenTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = text_splitter.transform_documents(docs)  In [22]:  print(chunks[10])  Out [22]:  page_content=' 
1.3 What is MLOps?   
MLOps, short for "Machine Learning Operations", is an extension to DevOps. It encompasses a  set of processes and 
automation for managing ML Model s, data and code to improve performance stability and long -term efficiency in ML 
systems. Put simply, MLOps = ModelOps + DataOps + DevOps . Subsequent sections will intricately dissect these 
processes, o ffering a detailed introduction to each.  
We often notice within UBS that the data science and IT teams tend to believe that relying solely on the DevOps process 
should suffice for handling both ML Model s and ML App lications. This viewpoint is largely influ enced by the success 
DevOps has achieved in managing analytic models. However, it's important to understand that ML App lications differ 
significantly from traditional software engineering and analytic models. They rely on a variety of interconnected 
elemen ts within the model.  
To address this, platforms like RiskLab have established clear -cut strategies that distinguish between ML Model  
development, analytic model development, and ML App lication development. This differentiation paves the way for a 
more cust omized and streamlined MLOps process that caters specifically to the requirements of ML Model s. 
 
1.4 MLOps Proc esses 
Machine Learning Operations (MLOps) is a set of practices that streamline and optimize the end -to-end ML Model  and 
ML App lication development, staging and production experience . In this introductory guide, we will explore the eight  
key processes involved in MLOps and their significance in building robust and scalable machine learning solutions.  
 
 
 
 
 
 Exploratory Data Analysis:  The journey of MLOps begins with Exploratory data analysis (EDA), it is 
conducted to gain valuable insights into the dataset, whether the data meets business 
requirements. Data scientists explore patterns, distributions, and correlations between variables 
to make informed decisions on feature selection and engineering. EDA also helps identify potential 
outliers or data issues that may affect model performance.  
 
Present state at  UBS:  
As of 2023, EDA solutions within UBS have progressed considerabl y.' metadata={'source_filename': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_url': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_class': 'RisklabPyPDFLoader', 'source': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'page': 5, 'metadata_model_class_name': {'RisklabDocumentMetadataModel': True, 'BaseRisklabDocumentMetadataModel': True}}
 In [23]:  # Try deleting the collection
try:
    vector_store.delete_collection()
except Exception:
    pass

vector_store.create_collection()
ids = vector_store.add_documents(documents=chunks)  In [24]:  print(vector_store.similarity_search_with_score("What is Feature Engineering?"))  Out [24]:  [(Document(metadata={'source_filename': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_url': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_class': 'RisklabPyPDFLoader', 'source': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'page': 6, 'metadata_model_class_name': {'RisklabDocumentMetadataModel': True, 'BaseRisklabDocumentMetadataModel': True}}, page_content='exploration solution for data scientists . Within the Group Function sector, RiskLab has partnered \nwith MEGDP and Cumulus to offer data scientists with strateg ic datahub exploration API s, granting \ndirect access to production data within  Lab development and validation environment . \nMoreover, the RiskL ab Model Data Sandbox (MDS) ecosystem has been established. This platform \nallows data scientists to conduct quick exploratory analyses on various sandbox datasets. These \ndatasets are stored within governed and compliant Azure ADLS storages, ensuring the good \ngovernance principles also applies to sandbox datasets . \n \n \n Data Preparation:  Raw Data is collected, cleaned, and transformed into a format suitable for \nmachine learning algorithms , usually using data pipeline  orchestration tools.  And in later steps, \ndata scientists will extract features and labels from the raw data.  \n  \nPresent state at UBS:  \nWithin the Group Function, Data Hubs such as MEGDP and Cumulus have successfully established \nrobust data pipelines and task frameworks. RiskLab has taken th e initiative to enable the \ndevelopment of these pipeline and task frameworks within the Laboratory environment, fortified \nby data governance support. Furthermore, RiskLab has introduced modern  Machine Learning data \npipeline frameworks, such as the Iterativ e.ai DVC pipeline . This provides a diversified range of \noptions to cater to the distinctive requirements of Machine Learning -specific use cases.  \n \n Feature Engineering:  Feature engineering aims to enhance data representation to improve model \nperformance. This involves creating new features or modifying existing ones. These features are \nthen divided into training, testing, and validation sets. In MLOps, there are patterns like the feature \nstore that aggregate transformed features for easier sharing and reuse. The feature store contains \npersisted features (datasets) or virtual features that can regenerate features from source datasets \nby applying a registered feature generati on function.  \n  \nPresent state at UBS:  \nFeature engineering is a fundamental aspect of ML Model  development, and Data Scientists should \nbe granted the flexibility to choose the most suitable feature engineering libraries and frameworks \nthat align with their model requirements. Most feature engineering libraries are integrated within \npopular framewor ks like Py'), 0.17580607730540854), (Document(metadata={'source_filename': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_url': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_class': 'RisklabPyPDFLoader', 'source': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'page': 6, 'metadata_model_class_name': {'RisklabDocumentMetadataModel': True, 'BaseRisklabDocumentMetadataModel': True}}, page_content=' Model  development, and Data Scientists should \nbe granted the flexibility to choose the most suitable feature engineering libraries and frameworks \nthat align with their model requirements. Most feature engineering libraries are integrated within \npopular framewor ks like PyTorch and TensorFlow, which can be supported by ML platforms. \nHowever, more advanced feature engineering frameworks such as Iterative.ai necessitate \ninfrastructure setup, such as a tenanted DVC registry. These dependencies have been addressed \nwithin RiskLab.  \n \nFeature engineering frequently makes use of a Feature Store to enhance feature shareability and \nreusability. However, RiskLab has adopted a cautious stance when it comes to utilizing feature \nstores provided by ML platforms. For instance, Domi no Data Lab has a built -in Feast feature store, \nand Azure Machine Learning Services and Databricks have their own implementations of feature \nstores. Nonetheless, these products rely on their individual persistent dataset storage solutions \nand do not integr ate seamlessly with UBS data hubs. Moreover, in some cases, they might not \ncomply with UBS data access security policies.  \n \nRather than fully embracing an external Feature Store, UBS could also develop its own Feature \nstore existing UBS data hubs like MEGDP  or Cumulus. These systems already possess robust dataset \nand transformation function versioning and management capabilities and are used for both \ndeveloping and deploying ML Model s. \n \nThe UBS feature store solution demands meticulous evaluation. We eagerly anticipate engaging in \na comprehensive discussion regarding the proposed solution in the future.  \n \n'), 0.1923856413909485), (Document(metadata={'source_filename': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_url': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_class': 'RisklabPyPDFLoader', 'source': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'page': 14, 'metadata_model_class_name': {'RisklabDocumentMetadataModel': True, 'BaseRisklabDocumentMetadataModel': True}}, page_content=' to manage machine learning features, aiming to ensure feature \nconsistency across training and inference. This encourages feature engineering reusability and \nfosters collaboration. It incorporates an offline store for model training, encompassing either \npersisted features or virtual features —a set of functions that generate features from underlying \npersisted features. Additionally, an online store is established for real -time predictions. Cloud \nvendor platforms or major  data science platforms such as Databricks typically develop their own \nimplementations using proprietary databases or storage technology. In contrast, data science ML \nplatforms often integrate market -leading open -source solutions like Feast . \n \n'), 0.19848291928181794), (Document(metadata={'source_filename': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_url': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'source_class': 'RisklabPyPDFLoader', 'source': 'RiskLab MLOps Whitepaper Review version 3.pdf', 'page': 28, 'metadata_model_class_name': {'RisklabDocumentMetadataModel': True, 'BaseRisklabDocumentMetadataModel': True}}, page_content=' 4.1 ML Model Dev  / ML App Prototype  \nIn the ML Model development environment, data scientists can perform exploratory data analysis, data and feature \nengineering, and build an ML Model training pipeline to train the model. The model code and training code can be \nsaved into GitLab for version control, and MLFlow experiment tracking can manage different experiments and runs for \ntrained model artifacts and metrics. RiskLab has introduced the concept of "snapshot experiment run" and "release \nexperiment run," where the snapshot run is triggered wit hin the Lab workspace potentially against an uncommitted \nML pipeline. On the other hand, the "release experiment run" is triggered on a GitLab agent against the release branch \nof the ML pipeline. The generated model artifact can reference the GitLab versio n of the ML training code release.  \nAdditionally, data scientists have the option to build ML App service endpoints and ML App prototypes to achieve faster \nfeedback from business owners.  \n \n \n \n1. Exploration Data Analysis:  RiskLab provides a rich set of APIs for  exploring UBS strategic data hubs on the \ncloud. These APIs allow governed access to production data. Additionally, RiskLab offers APIs to access \ndevelopment sandbox datasets.  \n \n2. UBS Production Data Mesh:  RiskLab  currently supports production data access to MEGDP , Cumulus, and Azure \nBlob File Storage accounts in IB DataHub and the RiskLab sandbox environment.  \n \n3. Data Preparation and Feature Engineering:  Data preparation can occur in various ways, such as using \nDatab ricks or Domino Data Lab Jobs to transform one dataset into another or defining an Iterative.ai DVC \ndataset transformation job. Feature engineering is currently carried out without a feature store, and all \nfeatures are generated as part of the ML pipeline.  \n \n4. Feature Store:  The feature store\'s viability depends on the underlying persistent storage and UBS\'s data mesh \nstrategy. This remains a technical debt  for UBS\'s central data team to address.  \n \n5. Model Code Development:  Model code can encompass a range of mod eling techniques, from developing a \nmodel algorithm independently to making adjustments to existing model algorithms or models from'), 0.20980138544994298)]
 In [25]:  from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

def qa_chain(
    question: str,
    num_docs: int = 4,
):
    docs = vector_store.similarity_search(question, k=num_docs)

    prompt = ChatPromptTemplate.from_template(
        "Please answer this question by using the context provided: {question}\n\nContext:{context}"
    )
    chain = create_stuff_documents_chain(llm, prompt)
    return chain.invoke(dict(context=docs, question=question))
  In [26]:  display(Markdown(qa_chain("What is Feature engineering? How can it be done better at UBS?")))  Out [26]:   Feature engineering is a crucial step in the machine learning process that involves transforming raw data into features that better represent the underlying patterns and relationships, thereby improving the performance of models. It often includes creating new features or modifying existing ones, and these features are then used in training, testing, and validation sets. Effective feature engineering can significantly impact the accuracy and efficiency of a machine learning model.At UBS, improving feature engineering can be approached in several ways:
Flexibility in Tools and Frameworks: UBS should continue to allow data scientists the flexibility to choose the most suitable feature engineering libraries and frameworks, as they are already doing. This flexibility ensures that data scientists can use the most effective tools that align with their specific model requirements.Internal Feature Store Development: Instead of relying on external feature stores that may not integrate seamlessly with UBS's existing data infrastructure and might not comply with UBS's data security policies, UBS could develop its own feature store using existing data hubs like MEGDP or Cumulus. These hubs already have robust dataset and transformation function versioning and management capabilities, making them a solid foundation for a custom feature store.Integration with Existing Data Hubs: The integration of feature engineering processes with UBS's strategic data hubs—MEGDP, Cumulus, and Azure Blob File Storage—should be enhanced. This could facilitate better data management and feature sharing, which is critical for model development and deployment.RiskLab's Role and Infrastructure: RiskLab's efforts in enabling ML model development should be expanded to support feature engineering more robustly. This includes leveraging their infrastructure, like the Iterative.ai DVC pipeline, to manage feature transformations and ensure consistent feature generation across different environments.Governance and Compliance: Ensuring that feature engineering processes adhere to UBS's data governance and compliance standards is crucial. This can be achieved by using governed APIs and datasets for exploration and development, as RiskLab currently provides.Addressing Technical Debt: The central data team at UBS should address the technical debt related to the feature store's underlying persistent storage and the data mesh strategy. This would provide a more stable and scalable infrastructure for feature engineering activities.Continuous Monitoring and A/B Testing: Incorporating continuous monitoring and A/B testing frameworks would enhance the feature engineering process by allowing data scientists to evaluate the impact of engineered features on model performance in a structured and systematic way.
By focusing on these areas, UBS can enhance its feature engineering capabilities, leading to better model performance and more efficient model development cycles. In [27]:  vector_store.delete_collection()
# To delete the collection when done experimenting
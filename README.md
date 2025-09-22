# techcat-studio
An AI-native development platform that helps engineers rapidly build and organize infrastructure documentation and agent-based workflows.

First, ensure the conda environment is activated:

```bash
conda deactivate
conda activate techcat-studio
```

To start the fastapi application, run:

```bash
uvicorn apps.api.main:app --port 9000 --reload
```

To start the Next.js application, run:

```bash
npm run dev 
```
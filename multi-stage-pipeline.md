# Multi-Stage Pipeline

> **Purpose:** Automated build-test-scan-deploy pipeline for a Node.js container, shipping to Azure Web App (Dev) and AKS (Prod) with gated approvals.

---

## 📑 Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Pipeline Stages](#pipeline-stages)
- [Troubleshooting](#troubleshooting)
- [Screenshots](#screenshots)

---

## Overview
This repo contains:
* **Application code** – sample Node.js API  
* **CI/CD pipeline** – multi-stage YAML (`azure-pipelines.yml`)  
* **Container assets** – `Dockerfile`, Helm chart, Terraform for AKS  

---

## Prerequisites
1. **Azure resources**  
   * Azure Container Registry (ACR) – `assessment.azurecr.io`  
   * Azure Web App for Containers – `nodejs`  
   * AKS cluster – `many-dogfish-aks`
2. **Service connections** in Azure DevOps  
   * Azure RM connection with contributor rights  
   * (Optional) Docker Registry service connection
3. **Tooling** (local development)  
   * Docker ≥ 20.10  
   * Node.js ≥ 18  
   * Azure CLI ≥ 2.57  
   * Terraform ≥ 1.8

---

## 🔄 Pipeline Stages

| Stage | Purpose | Key tasks / commands | Trigger & Gates |
|-------|---------|----------------------|-----------------|
| **build** | Compile & package the app into a container image. | `Docker@2` builds `assessment.azurecr.io/nodeapp:$(BuildId)` → `docker save` ➜ publish `image.tar.gz`. | First stage; stops on any Docker build error. |
| **test** | Run unit tests to validate code quality before promotion. | `npm install` → `npm test` with *mocha-junit-reporter* ➜ `PublishTestResults@2`. | Runs after **build**; fails on any failing test. |
| **scan** | Enforce container security early. | Re-load `image.tar.gz`, run **Trivy** `--severity CRITICAL --exit-code 1`. | Executes only if **test** succeeds; blocks on critical CVEs. |
| **push** | Publish the verified image to Azure Container Registry. | `docker login` (secrets `$(DOCKER_USER)` / `$(DOCKER_PASS)`) ➜ `docker tag` ➜ `docker push`. | Runs on successful **scan**. |
| **deploy_dev** | Continuous delivery to a Dev environment (Web App). | `az webapp config container set` to pull the new tag into Web App **nodejs**. | Auto-deploys after **push**; no manual approval. |
| **deploy_prod** | Controlled release to Production on AKS behind an approval gate. | `az aks get-credentials` ➜ `helm upgrade --install` with `--wait --atomic` ➜ `kubectl rollout status`. | Runs after **push** only after an approver approves the `prod` environment. |


## Screenshots

1. **Pipeline Result**
![Multi-stage-Pipeline](https://github.com/user-attachments/assets/ddbaf1f0-8c45-4ad2-9d98-31e128b6ab8e)

2. **Secret Usage Log**
<img width="1600" height="800" alt="image" src="https://github.com/user-attachments/assets/5477c9cd-2a51-4874-bdf5-366088a2eea4" />

3. **ACR Registry Image Snapshot**
<img width="1600" height="763" alt="image" src="https://github.com/user-attachments/assets/14159875-df17-4dd9-959a-a66b93547aca" />

4. **Docker Image Scan Log**
<img width="1600" height="789" alt="image" src="https://github.com/user-attachments/assets/2df8103a-212e-4c68-a119-97cfe9828904" />

5. **Unit Test Result**
<img width="1600" height="791" alt="image" src="https://github.com/user-attachments/assets/bd860f50-fc13-41d6-bc2e-93e6b25d4aa3" />

6. **Web App Deployment**
<img width="1600" height="830" alt="image" src="https://github.com/user-attachments/assets/7437c36d-364a-4402-9593-f2cdf22fedac" />

7. **Kubernetes Deployment**
<img width="1600" height="826" alt="image" src="https://github.com/user-attachments/assets/bd1ccd64-6295-412b-abbf-f8b36bc506fc" />








# Multi-Stage Pipeline

> **Purpose:** Automated build-test-scan-deploy pipeline for a Node.js container, shipping to Azure Web App (Dev) and AKS (Prod) with gated approvals.

---

## 📑 Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Pipeline Stages](#pipeline-stages)
- [Secrets & Security](#secrets--security)
- [Troubleshooting](#troubleshooting)

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


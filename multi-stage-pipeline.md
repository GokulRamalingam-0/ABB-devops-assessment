# Multi-Stage Pipeline

> **Purpose:** Automated build-test-scan-deploy pipeline for a Node.js container, shipping to Azure Web App (Dev) and AKS (Prod) with gated approvals.

---

## 📑 Table of Contents
- [Overview](#overview)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Pipeline Stages](#pipeline-stages)
- [Secrets & Security](#secrets--security)
- [Infrastructure-as-Code](#infrastructure-as-code)
- [Monitoring & Logging](#monitoring--logging)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview
This repo contains:
* **Application code** – sample Node.js API  
* **CI/CD pipeline** – multi-stage YAML (`azure-pipelines.yml`)  
* **Container assets** – `Dockerfile`, Helm chart, Terraform for AKS  
* **Docs** – markdown files that satisfy each assessment task

---

## Repository Structure

| Path | Purpose |
|------|---------|
| `azure-pipelines.yml` | Main multi-stage pipeline |
| `Dockerfile` | Builds the application image |
| `charts/nodeapp/` | Helm chart for AKS deployment |
| `terraform/aks-cluster.tf` | Terraform to provision AKS with Azure Monitor |
| `docs/` | Task-specific deliverables (branching strategy, cost report, etc.) |
| `scripts/` | Helper scripts & KQL queries |
| `README.md` | This file |

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

## Quick Start

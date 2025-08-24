# Assessment Documentation

This repository contains a collection of technical notes that support the assessment. Use the list below to navigate to each topic.

## Contents
- [Branching Strategy](branching-strategy.md)
- [Pull Request](pull_request.md)
- [Feature Branch](feature-branch.md)
- [Mitigations](mitigations.md)
- [Multi-Stage Pipeline](multi-stage-pipeline.md)
- [Monitoring](monitoring.md)

## K8s Deployments

### manifests/  
Hand-written YAML files for quick or one-off deployments.  

- `deployment.yaml` – defines the Deployment object (replicas, container image, resources, etc.).  
- `service.yaml` – exposes the Deployment via a ClusterIP, NodePort, or LoadBalancer Service.

### charts/  
Helm chart that packages the same resources in a reusable, parametrized format.  

- `templates/` – Helm templates for Deployment, Service, and any supporting objects.  
- `values.yaml` – default configuration values consumed by the templates.  
- `Chart.yaml` – chart metadata (name, version, dependencies).

Use `kubectl apply -f manifests/` for direct YAML or `helm install <release> charts/` for the chart-based workflow.

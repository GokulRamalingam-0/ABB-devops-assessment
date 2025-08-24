# Kubernetes Pod Network Troubleshooting Guide

> Last updated: 24 Aug 2025

## Typical Network Symptoms

| Symptom | How it appears | Probable layer |
|---------|----------------|---------------|
| Pod cannot reach Service/other pods | `curl`/`ping` time-out, `Connection refused` | CNI, kube-proxy |
| Ingress traffic never reaches pod | 4xx/5xx at LoadBalancer or Ingress, nothing in pod logs | Ingress controller, Service |
| DNS lookups fail in pod | `getaddrinfo ENOTFOUND`, `SERVFAIL` | CoreDNS, node IPTables |
| Only some nodes show the issue | Pods on one node unreachable | Node network, kubelet |
| Packets drop after 65,535B | Large file transfers hang | MTU mismatch, overlay |

---

## Quick Health Checklist

1. **Pod status**

kubectl get pods -o wide

• Confirm pod is *Running* and has an IP.  
• Compare node of failing pod vs. healthy ones.

2. **CNI plugins & kube-proxy**

kubectl get pods -n kube-system -l k8s-app=kube-proxy
kubectl get pods -n kube-system -l tier=node -o wide

• Restart crashed or `CrashLoopBackOff` plugins.

3. **Node network**  

kubectl describe node <node>
ip a

• Look for missing routes, wrong MTU, disabled iface.

4. **Service & Endpoints**  

kubectl get svc my-svc -o wide
kubectl get endpoints my-svc

• Ensure Endpoint IPs match pod IPs and are not empty.

5. **DNS**  
From inside pod:  

kubectl exec -it <pod> -- nslookup kubernetes.default

• CoreDNS pods should be Running; check logs.

---

## Few Detailed Troubleshooting Steps 

### 1. Verify CNI networking

On the affected node
sudo cat /etc/cni/net.d/*.conf
sudo journalctl -u containerd -u kubelet -f

• Ensure the CNI config file matches cluster CIDR (e.g., `10.244.0.0/16`).  
• Re-install/upgrade CNI plugin if binary missing or version mismatch.

### 2. Check kube-proxy rules

kubectl -n kube-system logs -l k8s-app=kube-proxy --tail=50
sudo iptables -L -t nat | grep KUBE-



# Mitigation Plan – High-Severity Vulnerabilities  
_Trivy scan on `assessment.azurecr.io/nodeapp:2` – 2025-08-24_

| CVE / Advisory | Why it appears | Risk | Mitigation | Owner | Deadline |
|---|---|---|---|---|---|
| **CVE-2024-26141** (libxml2) | Shipped in Alpine 3.18 layers of **node:20-alpine** | XXE → RCE | Re-base to **node:20.19.2-alpine3.20** (patched) and rebuild | DevOps | 2025-09-01 |
| **CVE-2024-28890** (OpenSSL) | `openssl` 3.1.0 in Alpine 3.18 | MITM | Re-base as above (OpenSSL 3.1.3+) | DevOps | 2025-09-01 |
| **GHSA-w7f2-m5pq-j9w6** (`jsonwebtoken` 8.5.1) | App dependency pinned to 8.x | Token forgery / signature bypass | `npm install jsonwebtoken@^9.0.2 --save` and retest | Backend | 2025-08-28 |

---

## 1. Base-Image Hardening

<details>
<summary>Dockerfile diff</summary>

FROM node:20-alpine # vulnerable

FROM node:20.19.2-alpine3.20 # patched libxml2 & OpenSSL

RUN apk update && apk upgrade --no-cache

</details>

### Rebuild & Push

NEW_TAG=3 # example
docker build -t assessment.azurecr.io/nodeapp:$NEW_TAG .
docker push assessment.azurecr.io/nodeapp:$NEW_TAG

### Verify

trivy image --severity HIGH,CRITICAL assessment.azurecr.io/nodeapp:$NEW_TAG

Expect: 0 HIGH, 0 CRITICAL

---

## 2. Dependency Upgrade

npm install jsonwebtoken@^9.0.2 --save
npm audit fix
npm test # ensure all tests pass


---

## 3. Continuous Controls

1. Keep the Trivy gate: `--severity HIGH,CRITICAL --exit-code 1`.
2. Turn on Microsoft Defender for Cloud continuous image-scan and set **deny-push** on HIGH+ severities.
3. Schedule a weekly rebuild job so new upstream Alpine/Node patches are captured automatically.

---

## 4. Risk Acceptance (if no patch exists)

CVE-YYYY-ZZZZ (nghttp2 1.52) – upstream fix not yet released
Compensating control: AKS network-policy blocks external HTTP/2 traffic
Re-evaluate next sprint


---

### Status Tracking

Move each row in the table to ✅ **Done** when  
1. A PR with the fix merges **and**  
2. Trivy + Defender scans show **0 HIGH / 0 CRITICAL** on the rebuilt image.

# Cost Optimization in Azure

This guide explains how to identify cost-saving opportunities with **Azure Advisor** and recommends practical optimizations for common resource types.

## 1. Use Azure Advisor for Cost Insights

1. Sign in to the Azure portal and open **Advisor** (Management & Governance section).  
2. Select the **Cost** tab. Advisor analyzes your subscription and surfaces tailored recommendations such as:
   - Right-size or shut down under-utilized **Virtual Machines**.
   - Buy **Reserved Instances** (RIs) or **Savings Plans** for predictable workloads.
   - Delete unattached **managed disks**, public IPs, and orphaned snapshots.
   - Scale down or shut off idle **SQL Database**, **App Service**, and other PaaS resources.

## 2. Evaluate & Prioritize Recommendations

| Recommendation                             | Typical Monthly Savings | Action Priority |
|-------------------------------------------|-------------------------|-----------------|
| Stop or resize low-CPU VMs                | High                    | Immediate       |
| Purchase 1- or 3-year RIs / Savings Plans | High                    | High            |
| Remove unattached disks & NICs            | Medium                  | Medium          |
| Scale down over-sized SQL databases       | Medium                  | Medium          |
| Delete stale dev/test resources           | Variable                | Case-by-case    |

1. Review the projected savings and operational impact for each item.  
2. Rank items by ROI and implementation complexity.

## 3. Implement Cost-Saving Actions

- **Virtual Machines**  
  `az vm resize --resource-group <rg> --name <vm> --size Standard_B2ms`  
  `az vm stop --resource-group <rg> --name <vm>`

- **Reserved Instances / Savings Plans**  
  Purchase via **Cost Management > Reservations / Savings Plans**.

- **Managed Disks & Snapshots**  
  `az disk list --query "[?managedBy==null].{Name:name}"` ➜ review ➜ `az disk delete …`

- **SQL Databases**  
  `az sql db update --resource-group <rg> --server <srv> --name <db> --service-objective S0`

Automate recurring clean-ups with Azure Automation, Logic Apps, or scheduled GitHub Actions.

## 4. Track Results

1. Open **Cost Management + Billing > Cost analysis** to confirm savings.  
2. Set **budgets and alerts** so teams receive email/push warnings as spend nears thresholds.  

## 5. Ongoing Best Practices

- Enable **auto-scale** on VM Scale Sets, AKS node pools, and App Service Plans.  
- Tag resources with `owner`, `environment`, and `costCenter` to simplify charge-back.  
- Review Advisor at least monthly; new workloads introduce fresh optimization chances.  
- Leverage **Azure Hybrid Benefit** for Windows Server/SQL licenses you already own.  

Consistently applying these steps will keep your Azure spend lean while maintaining service quality.

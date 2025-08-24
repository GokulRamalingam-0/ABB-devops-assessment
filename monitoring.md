# Monitoring

This document explains how to configure an Azure Monitor alert that fires when **CPU utilization on a Virtual Machine exceeds 70 %**.

## Prerequisites
- Azure subscription with at least one running VM.
- Contributor (or higher) role on the VM resource.
- The VM is sending metrics to Azure Monitor (enabled by default).

## Step-by-Step Guide

1. **Open Azure Monitor**  
   • Sign in to the Azure portal.  
   • Select **Monitor** from the left-hand menu.

2. **Start a New Alert Rule**  
   • In the Monitor blade, choose **Alerts** ➜ **+ Create** ➜ **Alert rule**.  

3. **Select Scope**  
   • Click **Select resource**.  
   • Pick the target **Virtual Machine** and press **Done**.

4. **Define the Condition**  
   • Choose **Add condition**.  
   • In the signal picker, search for **Percentage CPU** and select it.  
   • Configure:  
     – Aggregation: **Average**  
     – Operator: **Greater than**  
     – Threshold value: **70**  
     – Evaluation period: **5 minutes** (adjust if required)  
     – Frequency: **5 minutes** (default)

5. **Attach an Action Group**  
   • Click **Add action group** (or select an existing one).  
   • Provide a name and select your preferred notifications—e-mail, SMS, push, webhook, Logic App, etc.  
   • Save the action group.

6. **Set Alert Details**  
   • Alert rule name: e.g., **VM-CPU-Over-70**  
   • Description: *CPU average >70 % for 5 min*.  
   • Severity: **Sev 2** (or as per policy).  
   • Enable rule on creation: **Yes**.

7. **Review + Create**  
   • Verify scope, condition, actions, and details.  
   • Click **Create alert rule**.

## Tips
- Lower the evaluation period for quicker detection, but beware of transient spikes.  
- Combine this alert with auto-scale or runbook actions for automated remediation.  
- Confirm that diagnostic metrics retention meets your compliance needs.

## Screenshot
![WhatsApp Image 2025-08-24 at 2 00 32 PM](https://github.com/user-attachments/assets/7d0c2643-6c7a-4ec0-8e7c-31374fd88602)

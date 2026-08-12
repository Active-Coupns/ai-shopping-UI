# ShopSmart AI - Enterprise System Architecture & Security Documentation

This document outlines the system architecture, component design, data flow, regional infrastructure compliance, and security-by-design framework for the ShopSmart AI platform.

---

## 1. Executive Summary

ShopSmart AI is a high-performance, intelligent shopping assistant that identifies optimal purchase routes for users in real-time. The platform utilizes advanced natural language intent parsing to distinguish between e-commerce product recommendations and direct service coupons. It aggregates live pricing data across merchant platforms, identifies active discount vouchers, and generates unified matching insights for users under a low-latency caching system.

---

## 2. High-Level System Architecture

The following block diagram describes the system's end-to-end data flow and interaction boundaries between serverless APIs, storage databases, and third-party orchestration layers:

```
+---------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                    |
|                                                                                 |
|                        [ Client Browser UI (Next.js) ]                          |
+---------------------------------------------------------------------------------+
                                         |
                                         v (HTTPS Request + Auth JWT)
+---------------------------------------------------------------------------------+
|                            APPLICATION & API LAYER                              |
|                                                                                 |
|                      [ Next.js Serverless API Route ]                           |
|                                        |                                        |
|         +------------------------------+------------------------------+         |
|         |                              |                              |         |
|         v (Read/Write Session)         v (Read/Write Cache & Queue)   v         |
|  [ Supabase Auth ]             [ Upstash Redis ]               [ Supabase DB ]  |
+---------------------------------------------------------------------------------+
                                         |
                                         v (AI Intent Routing)
+---------------------------------------------------------------------------------+
|                           DATA & INTELLIGENCE LAYER                             |
|                                                                                 |
|         +-------------------------------------------------------------+         |
|         |        [ Proprietary Intent Classification AI /             |         |
|         |         Third-Party LLM Orchestration Layer ]               |         |
|         +------------------------------+------------------------------+         |
|                                        |                                        |
|                +-----------------------+-----------------------+                |
|                | (E-COMMERCE)                                  | (SERVICE)      |
|                v                                               v                |
|  [ Enterprise Multi-Store Data Ingestion                       [ Store Vouchers |
|    Pipeline / Third-Party E-Commerce Connectors ]               Database Query ] |
+---------------------------------------------------------------------------------+
```

---

## 3. Detailed Component Breakdown

### Client Layer
* **Next.js & React Framework**: Implements dynamic page hydration and responsive layouts.
* **Vanilla CSS Style Engine**: Tailored dark-theme system configures variables for glassmorphism panels, ambient background glow meshes, and high-tech typography.
* **Framer Motion Animations**: Features smooth 3D perspective tilts on product grid components, pulse-animated interactive radar scanning meters, and particle explosion bursts.

### Application & API Layer
* **Next.js Serverless Routes**: Exposes low-latency HTTP endpoint boundaries (`/api/search`, `/api/telemetry/click`).
* **Upstash Redis Caching**: Minimizes vendor API costs and optimizes response speeds to under 150ms by caching search payloads.
* **Request Concurrency Queue**: Regulates simultaneous API requests via a custom client queue, preventing rate-limiting blocks.
* **Supabase PostgreSQL & Session Provider**: Manages persistent customer account metadata, telemetry click counters, administrative platforms, and user credentials.

### Data & Intelligence Layer
* **Proprietary Intent Classification AI / Third-Party LLM Orchestration Layer**: Evaluates natural language queries to classify intents into `E-COMMERCE` (runs scrapers) or `SERVICE_COUPON` (bypasses scraping and fetches local database codes).
* **Enterprise Multi-Store Data Ingestion Pipeline / Third-Party E-Commerce Connectors**: Queries merchant index details, cleans tracking parameters from URLs, and returns direct purchase destinations.

---

## 4. Infrastructure & Data Residency

* **Hosting Architecture**: The entire application stack is deployed on the **Vercel Edge Network** with primary serverless endpoints operating in the **US-East (N. Virginia)** zone.
* **Persistent Storage Systems**: The Supabase PostgreSQL database instances are hosted in the **US-East (N. Virginia)** AWS regional clusters.
* **Caching Services**: Upstash Redis nodes are situated in the **US-East** zone.
* **Compliance Framework**: This localized US-East regional infrastructure ensures 100% compliance with **US Data Residency** regulations, CCPA regulations, and data sovereignty compliance.

---

## 5. Security-By-Design Framework

* **Disposable Email Blocker**: Rejects registration requests utilizing temporary or throwaway domains, protecting database tables against automated bot signups.
* **Input Debounce & Submit Throttling**: Limits input update frequencies to 300ms intervals and enforces a 1.5-second submission cooling throttle to mitigate denial-of-service API abuse.
* **Data Transport Encryption**: Enforces SSL/TLS security protocols for all database transactions and session token transmissions.
* **AES-256 Encryption Readiness**: Database tables are structured to support transparent column-level encryption for sensitive tokens.
* **Sanitized Destination Links**: Direct destination PDP links undergo validation guards to unwrap redirects and strip third-party trackers, preventing tracking leaks.

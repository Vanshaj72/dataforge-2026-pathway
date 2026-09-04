# Synaptic Plasticity as Short-Term Memory vs Transformer Key-Value Caching

**DataForge 2026 - Pathway Education Track Submission**

- **Deployed Live Explainer:** https://synaptic-chi.vercel.app
- **Target Audience:** Upper-level undergraduate and graduate data science students, AI researchers, and ML engineers looking to understand post-Transformer memory architectures.
- **Prerequisites:** Basic familiarity with linear algebra, Transformer attention mechanisms (Q, K, V), and computational complexity (O(N) vs O(1)).

---

## 1. Central Falsifiable Claim

> "A neural network using Hebbian synaptic writes updates session memory incrementally in O(1) time without expanding a Key-Value cache, but experiences associative state interference under high memory load."

---

## 2. Interactive Artifact Architecture

The explainer provides three main interactive sections designed to give instantaneous (<1s) feedback:

1. **Memory Growth Under Load (Section 01):**
   - **Interactive Control:** Sequence Length slider (100 to 10,000 tokens).
   - **Visualization:** Shows standard Transformer KV cache memory scaling linearly (O(N) at 0.5 MB/token) alongside BDH's fixed-size synaptic matrix (O(1) fixed at 320 MB).
   - **Ground Truth Comparison:** Computes the exact crossover point (~640 tokens) where KV caching exceeds synaptic memory overhead.

2. **Sparse vs. Dense Activations (Section 02):**
   - **Interactive Control:** Mode toggle between BDH (Sparse) and Transformer (Dense).
   - **Visualization:** A 336-unit activation grid demonstrating BDH's non-negative ~5% unit firing rate versus dense feed-forward activation.

3. **Pathway BDH Module & Trade-offs (Section 03):**
   - **Interactive Control:** Memory Load slider (0% to 100% capacity).
   - **Visualization:** Dynamically demonstrates memory recall degradation as the finite synaptic matrix experiences associative state interference.

---

## 3. Dragon Hatchling (BDH) Integration

The artifact explicitly contrasts standard softmax attention with BDH's biological synaptic update model:
- **Transformer Attention Read:** y = softmax(Q K^T) * V  --> O(N) memory growth
- **BDH Synaptic Write:** S <- S + eta * (psi(x) (x) rho(x)) --> O(1) rank-1 Hebbian update

---

## 4. Primary Citations (2022–2026)

1. **Pathway Research Team (2025/2026).** *Dragon Hatchling (BDH): Brain-Inspired Post-Transformer Architectures for Continual Session Memory.*
2. **Kosowski, A., Stamirowska, Z., & Chorowski, J. (2025).** *BDH-CQ: In-Context Learning and Latent Reasoning via Recurrent Synaptic Association.*
3. **Von Oswald, F., et al. (2023).** *Transformers learn in-context by gradient descent / Fast Weight Programmers.*

---

## 5. AI Assistance & Asset Disclosure

- **UI Development:** Layout and interactive frontend components were generated with assistance from v0.dev.
- **Code Logic:** Web application code was generated using automated LLM coding agents.
- **Hosting:** Deployed via Vercel / v0 platform.

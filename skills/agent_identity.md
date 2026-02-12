---
name: agent_identity
description: Create, upload, and register an on-chain agent identity (Stark License) on Base. Handles the full EIP-8004 registration flow including identity creation, upload to registry, token approval, broadcast, and on-chain registration.
version: "0.2.0"
tags:
  - crypto
  - finance
requires_tools:
  - modify_identity
  - web3_preset_function_call
  - broadcast_web3_tx
  - glob
  - say_to_user
  - ask_user
arguments:
  - name: name
    description: Agent name for the identity
    required: false
  - name: description
    description: Agent description
    required: false
---

# Agent Identity Skill

Register an on-chain agent identity (Stark License) on Base. This burns 1,000 STARKBOT tokens and mints an ERC-721 Agent License NFT.

## CRITICAL RULES

- You MUST broadcast the approve transaction and wait for confirmation BEFORE calling identity_register.
- NEVER call `identity_register` immediately after `identity_approve_registry`. The approve transaction is QUEUED, not broadcast. You must broadcast it first.
- If any step fails, stop and report the error to the user. Do not continue to the next step.

## Steps

### Step 1: Check for existing identity

Search for an `IDENTITY.json` or `identity.json` file in the workspace using `glob`.

- If found, read it with `modify_identity` (action: `read`) and confirm with the user if they want to use it or create a new one.
- If not found, read the current identity with `modify_identity` (action: `read`) to check if one already exists in the agent config.
- If no identity exists at all, create one (see Step 2).

### Step 2: Create identity (if needed)

If no identity exists, use `modify_identity` with action `create` to generate one. Use the `name` and `description` arguments if provided. If not provided, ask the user what to name their agent and how to describe it.

### Step 3: Upload to registry

Call `modify_identity` with action `upload`. This publishes the identity to identity.defirelay.com and sets the `agent_uri` register.

Confirm to the user that the upload was successful and show them the hosted URL.

### Step 4: Approve STARKBOT tokens

Call `web3_preset_function_call` with:
```json
{
  "network": "base",
  "preset": "identity_approve_registry"
}
```

This will return a QUEUED transaction with a UUID. **Save this UUID** — you need it for the next step.

Tell the user the approve transaction has been queued and needs to be broadcast.

### Step 5: Broadcast the approve transaction

**THIS STEP IS MANDATORY. DO NOT SKIP IT.**

Call `broadcast_web3_tx` with the transaction UUID from Step 4:
```json
{
  "tx_id": "<uuid from step 4>"
}
```

Wait for the transaction to be confirmed on-chain. If it fails, stop and report the error.

Tell the user the approve transaction has been broadcast and confirmed.

### Step 6: Register on-chain

Only after the approve transaction is confirmed, call `web3_preset_function_call` with:
```json
{
  "network": "base",
  "preset": "identity_register"
}
```

If this reverts, check:
- Did the approve transaction actually confirm? (If not, go back to Step 5)
- Does the wallet have at least 1,000 STARKBOT tokens on Base?
- Has the agent already been registered? (Check with the user)

### Step 7: Confirm registration

Tell the user their agent is now registered on-chain. Include:
- The agent's on-chain identity
- That their NFT has been minted
- That they can update their URI or metadata at any time

## Error Handling

- **"TRANSACTION QUEUED (not yet broadcast)"** — This means you need to call `broadcast_web3_tx`. Do NOT proceed to registration until the approve tx is broadcast and confirmed.
- **"RPC error 3: execution reverted"** on identity_register — The approve likely hasn't been confirmed. Broadcast it first.
- **Insufficient balance** — Tell the user they need 1,000 STARKBOT tokens on Base.
- **Already registered** — Tell the user their agent is already registered and offer to update the URI instead.

## Registration Without URI

If the user wants to register without setting a URI, use the `identity_register_no_uri` preset instead of `identity_register` in Step 6. Skip Steps 1-3 in this case.

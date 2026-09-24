# Dodo Checkout — Embeddable Checkout SDK

A small embeddable checkout experience built with React, TypeScript, and Tailwind CSS.

The goal was to build a checkout that a merchant can open through a small SDK API while keeping the payment experience isolated from the host page.

---

## Demo

Live demo:

> Add your deployed Vercel URL here

---

## What I Built

The project has two parts:

1. **Demo Store**
   - Represents a merchant website.
   - Opens the checkout through the SDK.
   - Receives checkout lifecycle callbacks.
   - Displays callback events for visibility.

2. **Embeddable Checkout**
   - Runs inside an iframe.
   - Handles customer/payment form state.
   - Shows loading, processing, success, and error states.
   - Communicates with the merchant through `postMessage`.

The host page does not directly control the payment form.

---

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Browser `postMessage` API

---

## Getting Started

### 1. Install dependencies

```bash
npm install
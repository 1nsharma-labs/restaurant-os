# 🍽️ Restaurant-OS — Open-Source Food & Cloud Kitchen Operating System

<p align="center">
  <img src="https://img.shields.io/badge/System-Restaurant--OS-ff7828?style=for-the-badge" alt="Restaurant OS">
  <img src="https://img.shields.io/badge/Commission-0%25%20Zero--Commission-10b981?style=for-the-badge" alt="0% Commission">
  <img src="https://img.shields.io/badge/Settlement-Direct%20UPI-00f0ff?style=for-the-badge" alt="Direct UPI">
  <img src="https://img.shields.io/badge/MCP-Native%20Stdio-a855f7?style=for-the-badge" alt="MCP Server">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License">
  <img src="https://img.shields.io/badge/Origin-Kanpur%2C%20India-ff9933?style=for-the-badge" alt="Made in India">
</p>

<p align="center">
  <strong>The complete open-source operating system for restaurants, cafes, cloud kitchens, and dhabas. Zero-commission digital QR menus, live Kitchen Display System (KDS), GST invoicing, and instant UPI settlement.</strong>
</p>

<p align="center">
  <a href="https://1nsharma-labs.github.io/restaurant-os/"><strong>🌐 Live Interactive Web Demo (Zero Login)</strong></a> &bull;
  <a href="#quickstart"><strong>Quickstart</strong></a> &bull;
  <a href="#core-features"><strong>Core Features</strong></a> &bull;
  <a href="#sponsorship--monetization"><strong>Sponsorship</strong></a>
</p>

---

> [!NOTE]
> **Live Auto-Sponsorship Slot Available:**
> Reach 25,000+ restaurant owners, cloud kitchen operators, and F&B entrepreneurs across India.
> **Book Slot:** Email [tech@mowglai.com](mailto:tech@mowglai.com) | Direct UPI: `6393741171@upi`

---

## 🏛️ Why Restaurant-OS?

Traditional food aggregator platforms (Zomato/Swiggy) take **25% to 35% commission** on every order, eating away the margins of small restaurants, cloud kitchens, and cafes.

**Restaurant-OS** gives food entrepreneurs complete sovereign control:
1. **0% Commission Direct QR Ordering:** Customers scan table QR, browse responsive digital menus, and order without app installation or login.
2. **Real-Time Kitchen Display System (KDS):** Digital bump-bar replaces physical paper KOTs with color-coded preparation timers.
3. **5% Restaurant GST & Split Billing:** Generates compliant tax invoices with CGST (2.5%) + SGST (2.5%).
4. **Direct UPI Instant Settlement:** Payments land directly in the owner's bank account via standard UPI QR (`6393741171@upi`) with zero intermediary holding.

---

## ⚡ Quickstart

### Instant CLI Execution (`npx`)

```bash
# Check system status
npx restaurant-os status

# View live digital menu
npx restaurant-os menu

# Place a table order
npx restaurant-os order T-04 "Paneer Butter Masala" "Butter Garlic Naan"

# View active Kitchen Display tickets
npx restaurant-os kds

# Generate GST invoice and UPI payment payload
npx restaurant-os bill ORD-101
```

### Local Setup & Testing

```bash
git clone https://github.com/1nsharma-labs/restaurant-os.git
cd restaurant-os

# Run automated tests
npm test

# Start Model Context Protocol (MCP) server
npm run mcp
```

---

## 🔌 Model Context Protocol (MCP) Integration

Connect Restaurant-OS to Cursor, Claude Desktop, or Antigravity:

```json
{
  "mcpServers": {
    "restaurant-os": {
      "command": "node",
      "args": ["/path/to/restaurant-os/core/src/mcp/server.js"]
    }
  }
}
```

Exposed MCP Tools:
- `restaurant_get_menu`: Filter and search menu catalog.
- `restaurant_place_order`: Place table orders programmatically.
- `restaurant_get_kds`: Inspect active kitchen tickets and prep timings.
- `restaurant_generate_bill`: Calculate 5% GST and direct UPI deep link.

---

## 💼 Sponsorship, Support & Founder

Built by **Amit Sharma (@1nsharma)** from **Kanpur, India**.

- **Personal Email:** [tech@mowglai.com](mailto:tech@mowglai.com)
- **Direct UPI & Bank Transfer:** `6393741171@upi` &bull; PhonePe / Google Pay / Paytm: `6393741171`
- **Global Sponsorship:** [polar.sh/1nsharma-labs](https://polar.sh/1nsharma-labs) &bull; [GitHub Sponsors](https://github.com/sponsors/1nsharma)
- **Organization:** [github.com/1nsharma-labs](https://github.com/1nsharma-labs)

---

## 📄 License

Open-source under the [MIT License](LICENSE).

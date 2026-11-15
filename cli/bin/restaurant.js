#!/usr/bin/env node

/**
 * Restaurant-OS CLI
 * 
 * Usage:
 *   npx restaurant-os status
 *   npx restaurant-os menu
 *   npx restaurant-os order T-04 "Paneer Butter Masala" "Butter Garlic Naan"
 *   npx restaurant-os kds
 *   npx restaurant-os bill ORD-101
 *   npx restaurant-os mcp
 */

import { MenuManager } from '../../core/src/menu.js';
import { OrderManager } from '../../core/src/orders.js';
import { BillingEngine } from '../../core/src/billing.js';
import { KitchenDisplaySystem } from '../../core/src/kds.js';
import { startMcpServer } from '../../core/src/mcp/server.js';

const args = process.argv.slice(2);
const command = args[0] || 'help';

async function main() {
  const menu = new MenuManager();
  const orders = new OrderManager();
  const billing = new BillingEngine();
  const kds = new KitchenDisplaySystem(orders);

  switch (command) {
    case 'status': {
      printBanner();
      console.log('🍽️  Restaurant-OS Architecture:');
      console.log('   ├── Zero-Commission Digital QR Menu');
      console.log('   ├── Kitchen Display System (KDS) & Bump Bar');
      console.log('   ├── 5% Restaurant GST Invoicing & Split Billing');
      console.log('   └── Direct UPI Soundbox & Payment Engine (6393741171@upi)\n');
      console.log('💼 Founder: Amit Sharma (@1nsharma) — Kanpur, India');
      console.log('📧 Contact: amitsharma9976@gmail.com');
      console.log('💳 Direct UPI / Bank: 6393741171@upi (6393741171)\n');
      break;
    }

    case 'menu': {
      console.log('\n📜 Restaurant-OS Live Digital Menu:\n');
      console.log('ID        Category        Price   Item Name');
      console.log('----------------------------------------------------------------------');
      for (const item of menu.getItems()) {
        const vegIcon = item.isVeg ? '🟢' : '🔴';
        console.log(`${item.id.padEnd(9)} ${item.category.padEnd(15)} ₹${item.price.toString().padEnd(6)} ${vegIcon} ${item.name} (${item.spiceLevel})`);
      }
      console.log('----------------------------------------------------------------------\n');
      break;
    }

    case 'order': {
      const table = args[1] || 'T-01';
      const itemNames = args.slice(2);
      const itemsToOrder = [];

      if (itemNames.length === 0) {
        itemsToOrder.push({ ...menu.getItemById('dish-01'), quantity: 1 });
        itemsToOrder.push({ ...menu.getItemById('dish-03'), quantity: 2 });
      } else {
        for (const name of itemNames) {
          const match = menu.searchItems(name)[0] || { name, price: 150 };
          itemsToOrder.push({ ...match, quantity: 1 });
        }
      }

      const order = orders.createOrder(table, itemsToOrder, { name: 'Dine-In Customer' });
      console.log(`\n🛎️ Order Placed Successfully:`);
      console.log(`   Order ID     : \x1b[32m${order.orderId}\x1b[0m`);
      console.log(`   Table        : ${order.tableNumber}`);
      console.log(`   Subtotal     : ₹${order.subtotal}`);
      console.log(`   Status       : ${order.status.toUpperCase()}`);
      console.log('   Items:');
      for (const it of order.items) {
        console.log(`     • ${it.quantity}x ${it.name} - ₹${it.total}`);
      }
      console.log('\nDispatched to Kitchen Display System (KDS).\n');
      break;
    }

    case 'kds': {
      // Seed a sample order for display
      orders.createOrder('T-04', [{ name: 'Paneer Butter Masala', price: 280, quantity: 1 }], { name: 'Rahul' });
      const tickets = kds.getKitchenTickets();

      console.log('\n🔥 Kitchen Display System (KDS) Active Tickets:\n');
      for (const t of tickets) {
        console.log(`   [${t.ticketId}] Table: ${t.tableNumber} | Status: \x1b[33m${t.status.toUpperCase()}\x1b[0m | Elapsed: ${t.elapsedMinutes}m`);
        for (const it of t.items) {
          console.log(`     -> ${it.quantity}x ${it.name}`);
        }
        console.log('');
      }
      break;
    }

    case 'bill': {
      const order = orders.createOrder('T-02', [
        { name: 'Chicken Dum Biryani', price: 340, quantity: 2 },
        { name: 'Gulab Jamun (2 Pcs)', price: 90, quantity: 1 }
      ], { name: 'Pooja Sharma' });

      const bill = billing.generateBill(order);

      console.log('\n🧾 GST Tax Invoice & UPI Settlement:');
      console.log('----------------------------------------------------------------------');
      console.log(`Invoice No   : ${bill.invoiceNumber}`);
      console.log(`Order ID     : ${bill.orderId} (Table ${bill.tableNumber})`);
      console.log(`Subtotal     : ₹${bill.subtotal}`);
      console.log(`CGST (2.5%)  : ₹${bill.cgst}`);
      console.log(`SGST (2.5%)  : ₹${bill.sgst}`);
      console.log(`Grand Total  : \x1b[32m₹${bill.grandTotal} INR\x1b[0m`);
      console.log(`Payee UPI    : \x1b[36m${bill.payeeUpi}\x1b[0m`);
      console.log(`UPI String   : ${bill.upiDeepLink}`);
      console.log('----------------------------------------------------------------------\n');
      break;
    }

    case 'mcp': {
      startMcpServer();
      break;
    }

    case 'help':
    default: {
      printBanner();
      console.log('Usage:');
      console.log('  restaurant-os status                    Inspect architecture');
      console.log('  restaurant-os menu                      List digital menu');
      console.log('  restaurant-os order <tableNum> [items]  Place table order');
      console.log('  restaurant-os kds                       View kitchen tickets');
      console.log('  restaurant-os bill <orderId>            Generate GST invoice & UPI payload');
      console.log('  restaurant-os mcp                       Start MCP stdio server');
      console.log('\nLive Web App:');
      console.log('  https://1nsharma-labs.github.io/restaurant-os/\n');
      break;
    }
  }
}

function printBanner() {
  console.log(`
\x1b[33m  ██████╗ ███████╗███████╗████████╗ █████╗ ██╗   ██╗██████╗  █████╗ ███╗   ██╗████████╗     ██████╗ ███████╗
  ██╔══██╗██╔════╝██╔════╝╚══██╔══╝██╔══██╗██║   ██║██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝    ██╔═══██╗██╔════╝
  ██████╔╝█████╗  ███████╗   ██║   ███████║██║   ██║██████╔╝███████║██╔██╗ ██║   ██║       ██║   ██║███████╗
  ██╔══██╗██╔══╝  ╚════██║   ██║   ██╔══██║██║   ██║██╔══██╗██╔══██║██║╚██╗██║   ██║       ██║   ██║╚════██║
  ██║  ██║███████╗███████║   ██║   ██║  ██║╚██████╔╝██║  ██║██║  ██║██║ ╚████║   ██║       ╚██████╔╝███████║
  ╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝        ╚═════╝ ╚══════╝\x1b[0m
  The Open-Source Restaurant, Cafe & Cloud Kitchen Operating System
  by 1nsharma-labs | Amit Sharma (Kanpur, India)
  `);
}

main().catch(err => {
  console.error('\nFatal Error:', err);
  process.exit(1);
});

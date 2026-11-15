/**
 * Automated Test Suite for Restaurant-OS
 */

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { MenuManager, DEFAULT_MENU } from '../core/src/menu.js';
import { OrderManager } from '../core/src/orders.js';
import { BillingEngine } from '../core/src/billing.js';
import { KitchenDisplaySystem } from '../core/src/kds.js';
import { RestaurantMcpServer } from '../core/src/mcp/server.js';

describe('Restaurant-OS Menu Manager', () => {
  const menu = new MenuManager();

  it('should list all default menu items', () => {
    assert.strictEqual(menu.getItems().length, DEFAULT_MENU.length);
  });

  it('should filter by category Mains', () => {
    const mains = menu.getItems('Mains');
    assert.ok(mains.length >= 2);
    assert.ok(mains.every(i => i.category === 'Mains'));
  });

  it('should search dishes by keyword', () => {
    const results = menu.searchItems('biryani');
    assert.ok(results.length >= 1);
    assert.strictEqual(results[0].name, 'Chicken Dum Biryani');
  });
});

describe('Restaurant-OS Orders & KDS', () => {
  const orders = new OrderManager();
  const kds = new KitchenDisplaySystem(orders);

  it('should create a valid order with total calculation', () => {
    const order = orders.createOrder('T-05', [
      { id: 'dish-01', name: 'Paneer Butter Masala', price: 280, quantity: 2 },
      { id: 'dish-03', name: 'Butter Garlic Naan', price: 60, quantity: 4 }
    ], { name: 'Vikram', phone: '9876543210' });

    assert.ok(order.orderId.startsWith('ORD-'));
    assert.strictEqual(order.subtotal, 280 * 2 + 60 * 4); // 560 + 240 = 800
    assert.strictEqual(order.status, 'placed');
  });

  it('should generate KDS ticket for active order', () => {
    const tickets = kds.getKitchenTickets();
    assert.ok(tickets.length >= 1);
    assert.strictEqual(tickets[0].tableNumber, 'T-05');
  });

  it('should bump order status to ready', () => {
    const tickets = kds.getKitchenTickets();
    const updated = kds.bumpTicket(tickets[0].orderId, 'ready');
    assert.strictEqual(updated.status, 'ready');
  });
});

describe('Restaurant-OS GST Billing & UPI', () => {
  const orders = new OrderManager();
  const billing = new BillingEngine();

  it('should compute exact 5% restaurant GST and UPI deep link', () => {
    const order = orders.createOrder('T-01', [
      { id: 'dish-01', name: 'Paneer Butter Masala', price: 280, quantity: 1 }
    ]);
    const bill = billing.generateBill(order);

    assert.strictEqual(bill.subtotal, 280);
    assert.strictEqual(bill.cgst, 7); // 2.5% of 280 = 7
    assert.strictEqual(bill.sgst, 7); // 2.5% of 280 = 7
    assert.strictEqual(bill.grandTotal, 294); // 280 + 14 = 294
    assert.strictEqual(bill.payeeUpi, '6393741171@upi');
    assert.ok(bill.upiDeepLink.includes('6393741171%40upi'));
    assert.ok(bill.upiDeepLink.includes('am=294'));
  });
});

describe('Restaurant-OS MCP Server', () => {
  const server = new RestaurantMcpServer();

  it('should register all 5 tools', () => {
    const tools = server.getTools();
    assert.strictEqual(tools.length, 5);
  });

  it('should call restaurant_status tool', async () => {
    const res = await server.handleCallTool('restaurant_status', {});
    const parsed = JSON.parse(res.content[0].text);
    assert.strictEqual(parsed.product, 'Restaurant-OS');
    assert.strictEqual(parsed.upi, '6393741171@upi');
  });
});

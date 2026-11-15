/**
 * Restaurant-OS Model Context Protocol (MCP) Server
 */

import readline from 'readline';
import { MenuManager } from '../menu.js';
import { OrderManager } from '../orders.js';
import { BillingEngine } from '../billing.js';
import { KitchenDisplaySystem } from '../kds.js';

export class RestaurantMcpServer {
  constructor() {
    this.menu = new MenuManager();
    this.orders = new OrderManager();
    this.billing = new BillingEngine();
    this.kds = new KitchenDisplaySystem(this.orders);
  }

  getTools() {
    return [
      {
        name: 'restaurant_get_menu',
        description: 'Retrieve the restaurant digital menu items with category and search filtering.',
        inputSchema: {
          type: 'object',
          properties: {
            category: { type: 'string', description: 'Category filter (e.g., Mains, Breads, Rice, Beverages)' },
            query: { type: 'string', description: 'Search term' }
          }
        }
      },
      {
        name: 'restaurant_place_order',
        description: 'Place a table or takeaway food order.',
        inputSchema: {
          type: 'object',
          properties: {
            tableNumber: { type: 'string', description: 'Table number or "Takeaway"' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  price: { type: 'number' },
                  quantity: { type: 'number' }
                },
                required: ['name', 'price']
              }
            },
            customerName: { type: 'string' },
            customerPhone: { type: 'string' }
          },
          required: ['tableNumber', 'items']
        }
      },
      {
        name: 'restaurant_get_kds',
        description: 'Get live Kitchen Display System (KDS) tickets and preparation status.',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'restaurant_generate_bill',
        description: 'Generate GST invoice and direct UPI settlement link for an order.',
        inputSchema: {
          type: 'object',
          properties: {
            orderId: { type: 'string', description: 'Order ID' },
            discountRate: { type: 'number', description: 'Discount fraction (e.g. 0.1 for 10%)' }
          },
          required: ['orderId']
        }
      },
      {
        name: 'restaurant_status',
        description: 'Inspect Restaurant-OS system status, version, and founder contact.',
        inputSchema: { type: 'object', properties: {} }
      }
    ];
  }

  async handleCallTool(name, args) {
    switch (name) {
      case 'restaurant_get_menu': {
        let items = this.menu.getItems(args.category);
        if (args.query) items = this.menu.searchItems(args.query);
        return { content: [{ type: 'text', text: JSON.stringify(items, null, 2) }] };
      }
      case 'restaurant_place_order': {
        const order = this.orders.createOrder(args.tableNumber, args.items, {
          name: args.customerName,
          phone: args.customerPhone
        });
        return { content: [{ type: 'text', text: JSON.stringify(order, null, 2) }] };
      }
      case 'restaurant_get_kds': {
        const tickets = this.kds.getKitchenTickets();
        return { content: [{ type: 'text', text: JSON.stringify(tickets, null, 2) }] };
      }
      case 'restaurant_generate_bill': {
        const order = this.orders.getOrder(args.orderId);
        if (!order) throw new Error(`Order ${args.orderId} not found`);
        const bill = this.billing.generateBill(order, { discountRate: args.discountRate });
        return { content: [{ type: 'text', text: JSON.stringify(bill, null, 2) }] };
      }
      case 'restaurant_status': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              product: 'Restaurant-OS',
              version: '1.0.0',
              architecture: 'Zero-Commission Food & Cloud Kitchen Engine',
              founder: 'Amit Sharma (@1nsharma) — Kanpur, India',
              contact: 'amitsharma9976@gmail.com',
              upi: '6393741171@upi'
            }, null, 2)
          }]
        };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  startStdio() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
    rl.on('line', async (line) => {
      if (!line.trim()) return;
      try {
        const req = JSON.parse(line);
        const res = await this.handleRpc(req);
        if (res) process.stdout.write(JSON.stringify(res) + '\n');
      } catch (err) {
        process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32603, message: err.message } }) + '\n');
      }
    });
  }

  async handleRpc(req) {
    const { id, method, params } = req;
    if (method === 'initialize') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          serverInfo: { name: 'restaurant-os-mcp', version: '1.0.0' },
          capabilities: { tools: {} }
        }
      };
    }
    if (method === 'tools/list') {
      return { jsonrpc: '2.0', id, result: { tools: this.getTools() } };
    }
    if (method === 'tools/call') {
      try {
        const res = await this.handleCallTool(params.name, params.arguments || {});
        return { jsonrpc: '2.0', id, result: res };
      } catch (err) {
        return { jsonrpc: '2.0', id, error: { code: -32000, message: err.message } };
      }
    }
    return null;
  }
}

export function startMcpServer() {
  const server = new RestaurantMcpServer();
  server.startStdio();
}

if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startMcpServer();
}

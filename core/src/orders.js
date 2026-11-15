/**
 * Restaurant-OS Order Lifecycle & Table Manager
 */

export class OrderManager {
  constructor() {
    this.orders = new Map();
    this.orderSeq = 100;
  }

  createOrder(tableNumber, items, customerInfo = {}) {
    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    this.orderSeq++;
    const orderId = `ORD-${this.orderSeq}`;
    const timestamp = Date.now();

    let subtotal = 0;
    const resolvedItems = items.map(item => {
      const total = (item.price || 0) * (item.quantity || 1);
      subtotal += total;
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        total,
        instructions: item.instructions || ''
      };
    });

    const order = {
      orderId,
      tableNumber: tableNumber || 'Takeaway',
      customerName: customerInfo.name || 'Guest',
      customerPhone: customerInfo.phone || '',
      items: resolvedItems,
      subtotal,
      status: 'placed', // placed -> preparing -> ready -> served -> settled
      placedAt: new Date(timestamp).toISOString(),
      updatedAt: new Date(timestamp).toISOString()
    };

    this.orders.set(orderId, order);
    return order;
  }

  updateOrderStatus(orderId, status) {
    const order = this.orders.get(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const validStatuses = ['placed', 'preparing', 'ready', 'served', 'settled', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of ${validStatuses.join(', ')}`);
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }

  getOrder(orderId) {
    return this.orders.get(orderId) || null;
  }

  listActiveOrders() {
    return Array.from(this.orders.values()).filter(o => o.status !== 'settled' && o.status !== 'cancelled');
  }
}

export const defaultOrderManager = new OrderManager();

/**
 * Restaurant-OS Kitchen Display System (KDS) Engine
 */

export class KitchenDisplaySystem {
  constructor(orderManager) {
    this.orderManager = orderManager;
  }

  getKitchenTickets() {
    const activeOrders = this.orderManager.listActiveOrders();
    const now = Date.now();

    return activeOrders.map(order => {
      const placedTime = new Date(order.placedAt).getTime();
      const elapsedMinutes = Math.floor((now - placedTime) / 60000);

      let urgency = 'normal'; // normal (<10m) -> warning (10-20m) -> critical (>20m)
      if (elapsedMinutes >= 20) {
        urgency = 'critical';
      } else if (elapsedMinutes >= 10) {
        urgency = 'warning';
      }

      return {
        ticketId: `KDS-${order.orderId}`,
        orderId: order.orderId,
        tableNumber: order.tableNumber,
        items: order.items,
        status: order.status,
        elapsedMinutes,
        urgency,
        placedAt: order.placedAt
      };
    });
  }

  bumpTicket(orderId, nextStatus = 'ready') {
    return this.orderManager.updateOrderStatus(orderId, nextStatus);
  }
}

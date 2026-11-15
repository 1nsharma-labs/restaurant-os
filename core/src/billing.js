/**
 * Restaurant-OS GST Billing, Discount & UPI Settlement Engine
 */

export class BillingEngine {
  constructor(options = {}) {
    this.gstRate = options.gstRate || 0.05; // 5% standard restaurant GST in India (2.5% CGST + 2.5% SGST)
    this.payeeUpi = options.payeeUpi || '6393741171@upi';
    this.payeeName = options.payeeName || 'Amit Sharma';
  }

  generateBill(order, options = {}) {
    if (!order) throw new Error('Order is required for billing');

    const subtotal = order.subtotal || 0;
    const discountRate = options.discountRate || 0; // e.g. 0.1 for 10%
    const discountAmount = Math.round(subtotal * discountRate);
    const taxableAmount = subtotal - discountAmount;

    // Calculate CGST and SGST
    const cgst = Number((taxableAmount * (this.gstRate / 2)).toFixed(2));
    const sgst = Number((taxableAmount * (this.gstRate / 2)).toFixed(2));
    const totalTax = Number((cgst + sgst).toFixed(2));

    const grandTotal = Math.round(taxableAmount + totalTax);

    // Direct UPI Deep Link String (NPCI Standard)
    const upiString = `upi://pay?pa=${encodeURIComponent(this.payeeUpi)}&pn=${encodeURIComponent(this.payeeName)}&am=${grandTotal}&tn=${encodeURIComponent('Bill for ' + order.orderId)}&cu=INR`;

    return {
      invoiceNumber: `INV-${order.orderId.replace('ORD-', '')}-${Date.now().toString().slice(-4)}`,
      orderId: order.orderId,
      tableNumber: order.tableNumber,
      customerName: order.customerName,
      items: order.items,
      subtotal,
      discountAmount,
      taxableAmount,
      cgst,
      sgst,
      totalTax,
      grandTotal,
      currency: 'INR',
      paymentMethod: 'UPI / Direct Bank',
      payeeUpi: this.payeeUpi,
      upiDeepLink: upiString,
      status: 'pending_payment',
      createdAt: new Date().toISOString()
    };
  }
}

export const defaultBilling = new BillingEngine();

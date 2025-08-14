import {Invoice, OrderDetail} from "@/types/types";
import {getLocalizedText} from "@/languages/languages";

export function genHtmlInvoice(invoice: Invoice) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <title>Invoice ${invoice.order.orderCode}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            padding: 20px;
        }

        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
        }

        .company-info h1 {
            color: #2563eb;
            font-size: 28px;
            margin-bottom: 5px;
        }

        .company-info p {
            color: #666;
            margin-bottom: 3px;
        }

        .invoice-title {
            text-align: right;
        }

        .invoice-title h2 {
            font-size: 36px;
            color: #2563eb;
            margin-bottom: 10px;
        }

        .invoice-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }

        .bill-to, .invoice-details {
            background: #f8fafc;
            padding: 20px;
            border-radius: 6px;
        }

        .bill-to h3, .invoice-details h3 {
            color: #2563eb;
            margin-bottom: 15px;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .bill-to p, .invoice-details p {
            margin-bottom: 5px;
        }

        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        .invoice-table th {
            background: #2563eb;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }

        .invoice-table td {
            padding: 15px;
            border-bottom: 1px solid #e5e7eb;
        }

        .invoice-table tr:nth-child(even) {
            background: #f9fafb;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
        }

        .totals-table {
            width: 300px;
        }

        .totals-table tr td {
            padding: 8px 15px;
            border: none;
        }

        .totals-table tr:last-child {
            background: #2563eb;
            color: white;
            font-weight: bold;
            font-size: 18px;
        }

        .subtotal-row {
            border-top: 1px solid #e5e7eb;
        }

        .invoice-footer {
            border-top: 2px solid #e5e7eb;
            padding-top: 20px;
            text-align: center;
            color: #666;
        }

        .payment-terms {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 20px;
        }

        .payment-terms h4 {
            color: #92400e;
            margin-bottom: 10px;
        }

        /* Print Styles */
        @media print {
            body {
                background: white;
                padding: 0;
            }

            .invoice-container {
                box-shadow: none;
                border-radius: 0;
                padding: 20px;
                margin: 0;
                max-width: none;
            }

            .invoice-header {
                border-bottom: 2px solid #000;
            }

            .company-info h1,
            .invoice-title h2,
            .bill-to h3,
            .invoice-details h3 {
                color: #000 !important;
            }

            .invoice-table th {
                background: #000 !important;
                color: white !important;
            }

            .totals-table tr:last-child {
                background: #000 !important;
                color: white !important;
            }

            .payment-terms {
                background: #f5f5f5 !important;
                border: 1px solid #ccc !important;
            }

            .payment-terms h4 {
                color: #000 !important;
            }
        }

        @page {
            margin: 0.5in;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Invoice Header -->
        <div class="invoice-header">
            <div class="company-info">
                <h1>${invoice.company.companyName}</h1>
<!--                <p>123 Business Street</p>-->
<!--                <p>City, State 12345</p>-->
<!--                <p>Phone: (555) 123-4567</p>-->
<!--                <p>Email: info@yourcompany.com</p>-->
            </div>
            <div class="invoice-title">
                <h2>${invoice.order.orderCode}</h2>
<!--                <p><strong>${getLocalizedText('invoice').toUpperCase()}</strong></p>-->
            </div>
        </div>
        <!-- Invoice Meta Information -->
        <div class="invoice-meta">
            <div class="bill-to">
<!--                <h3>Bill To</h3>-->
<!--                <p><strong>Client Company Name</strong></p>-->
                <p>${invoice.customer.customerName}</p>
<!--                <p>456 Client Avenue</p>-->
<!--                <p>Client City, State 67890</p>-->
<!--                <p>john@clientcompany.com</p>-->
            </div>
            <div class="invoice-details">
<!--                <h3>${getLocalizedText('details')}</h3>-->
                <p><strong>${getLocalizedText('date')}: </strong>${(new Date(invoice.order.orderDate)).toDateString()}</p>
<!--                <p><strong>Due Date:</strong> February 14, 2024</p>-->
<!--                <p><strong>Payment Terms:</strong> Net 30</p>-->
<!--                <p><strong>Project:</strong> Website Development</p>-->
            </div>
        </div>
        <!-- Invoice Items Table -->
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>${getLocalizedText('description')}</th>
                    <th class="text-center">${getLocalizedText('qty')}</th>
                    <th class="text-right">${getLocalizedText('rate')}</th>
                    <th class="text-right">${getLocalizedText('amount')}</th>
                </tr>
            </thead>
            <tbody>
` + (invoice.orderDetails.map((orderDetail: OrderDetail) => {
        return (`<tr>
                        <td>
                            <small>${orderDetail.orderDetailName}</small>
                        </td>
                        <td class="text-center">${orderDetail.orderDetailQuantity}</td>
                            <td class="text-right">${orderDetail.orderDetailPrice}</td>
                        <td class="text-right">${(orderDetail.orderDetailPrice * orderDetail.orderDetailQuantity).toFixed(2)}</td>
                        </tr>`)
    })) + `                
            </tbody>
        </table>

        <!-- Totals Section -->
        <div class="totals-section">
            <table class="totals-table">
<!--                <tr class="subtotal-row">-->
<!--                    <td><strong>Subtotal:</strong></td>-->
<!--                    <td class="text-right">$4,600.00</td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                    <td><strong>Tax (8.5%):</strong></td>-->
<!--                    <td class="text-right">$391.00</td>-->
<!--                </tr>-->
                <tr>
                    <td><strong>TOTAL:</strong></td>
                    <td class="text-right"><strong>$ </strong>${invoice.total}</td>
                </tr>
            </table>
        </div>

        <!-- Payment Terms -->
<!--        <div class="payment-terms">-->
<!--            <h4>Payment Information</h4>-->
<!--            <p><strong>Payment Method:</strong> Bank Transfer, Check, or Credit Card</p>-->
<!--            <p><strong>Bank Details:</strong> Account #: 123456789, Routing #: 987654321</p>-->
<!--            <p><strong>Late Fee:</strong> 1.5% per month on overdue amounts</p>-->
<!--        </div>-->

        <!-- Invoice Footer -->
        <div class="invoice-footer">
        ` + (`<p><strong>${getLocalizedText('invoice_signature')}: </strong>${invoice.order.orderSignature}</p>`) + `
<!--            <p>Thank you for your business!</p>-->
<!--            <p>If you have any questions about this invoice, please contact us at (555) 123-4567</p>-->
        </div>
    </div>
</body>
</html>`;
}
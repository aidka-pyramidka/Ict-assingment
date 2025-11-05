/** 
 * Order class
 * Author: Aida Alimzhanova
 * Date: 2025-10-27
 */
package ecommerce.models;

import java.util.ArrayList;
import java.util.List;

public class Order {
    private int orderId;
    private Customer customer;
    private List<OrderItem> items;

    public Order(int orderId, Customer customer) {
        this.orderId = orderId;
        this.customer = customer;
        this.items = new ArrayList<>();
    }

    public int getOrderId() { return orderId; }
    public Customer getCustomer() { return customer; }
    public List<OrderItem> getItems() { return items; }

    public void addItem(Product product, int quantity) {
        if (product == null || quantity <= 0) return;
        items.add(new OrderItem(product, quantity));
    }

    public double getTotalAmount() {
        double total = 0.0;
        for (OrderItem item : items) {
            total += item.getLineTotal();
        }
        return total;
    }

    public void printReceipt() {
        System.out.println("====================================");
        System.out.println("Order Receipt - ID: " + orderId);
        System.out.println("Customer: " + customer.getName() + " (" + customer.getEmail() + ")");
        System.out.println("------------------------------------");
        for (OrderItem item : items) {
            System.out.printf("%-25s x%-3d = %8.2f\n",
                item.getProduct().getName(),
                item.getQuantity(),
                item.getLineTotal());
        }
        System.out.println("------------------------------------");
        System.out.printf("TOTAL: %33.2f\n", getTotalAmount());
        System.out.println("====================================");
    }
}

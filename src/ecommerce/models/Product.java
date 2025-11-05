/** 
 * Base Product class
 * Author: Aida Alimzhanova
 * Date: 2025-10-27
 */
package ecommerce.models;

public abstract class Product {
    private int id;
    private String name;
    private double price;
    private int stockQuantity;

    public Product(int id, String name, double price, int stockQuantity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stockQuantity = stockQuantity;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }

    public boolean reduceStock(int qty) {
        if (qty <= 0) return false;
        if (stockQuantity >= qty) {
            stockQuantity -= qty;
            return true;
        }
        return false;
    }

    public void increaseStock(int qty) {
        if (qty > 0) stockQuantity += qty;
    }

    public abstract void displayInfo();
}

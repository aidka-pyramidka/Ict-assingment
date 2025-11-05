/** 
 * Electronics extends Product
 * Author: Aida Alimzhanova
 * Date: 2025-10-27
 */
package ecommerce.models;

public class Electronics extends Product {
    private String brand;
    private int warrantyMonths;

    public Electronics(int id, String name, double price, int stockQuantity, String brand, int warrantyMonths) {
        super(id, name, price, stockQuantity);
        this.brand = brand;
        this.warrantyMonths = warrantyMonths;
    }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public int getWarrantyMonths() { return warrantyMonths; }
    public void setWarrantyMonths(int warrantyMonths) { this.warrantyMonths = warrantyMonths; }

    @Override
    public void displayInfo() {
        System.out.printf("Electronics [ID:%d] %s | Brand: %s | Warranty: %d months | Price: %.2f | Stock: %d\n",
            getId(), getName(), brand, warrantyMonths, getPrice(), getStockQuantity());
    }
}

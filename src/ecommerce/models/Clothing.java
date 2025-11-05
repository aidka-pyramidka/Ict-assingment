/** 
 * Clothing extends Product
 * Author: Aida Alimzhanova
 * Date: 2025-10-27
 */
package ecommerce.models;

public class Clothing extends Product {
    private String size;
    private String material;

    public Clothing(int id, String name, double price, int stockQuantity, String size, String material) {
        super(id, name, price, stockQuantity);
        this.size = size;
        this.material = material;
    }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }

    @Override
    public void displayInfo() {
        System.out.printf("Clothing [ID:%d] %s | Size: %s | Material: %s | Price: %.2f | Stock: %d\n",
            getId(), getName(), size, material, getPrice(), getStockQuantity());
    }
}

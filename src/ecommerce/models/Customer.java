/** 
 * Customer class extends User
 * Author: Aida Alimzhanova
 * Date: 2025-10-27
 */
package ecommerce.models;

public class Customer extends User {
    private String address;

    public Customer(String name, String email, String password, String address) {
        super(name, email, password, "customer");
        this.address = address;
    }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    @Override
    public void displayInfo() {
        System.out.println("Customer: " + getName() + " | Email: " + getEmail() + " | Address: " + address);
    }
}

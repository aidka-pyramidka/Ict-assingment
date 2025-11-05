/** 
 * Employee class extends User
 * Author: Aida Alimzhanova
 * Date: 2025-10-27
 */
package ecommerce.models;

public class Employee extends User {
    private String position;

    public Employee(String name, String email, String password, String position) {
        super(name, email, password, "employee");
        this.position = position;
    }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    @Override
    public void displayInfo() {
        System.out.println("Employee: " + getName() + " | Email: " + getEmail() + " | Position: " + position);
    }
}

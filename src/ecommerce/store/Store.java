/** 
 * Store repository and services
 * Author: Aida Alimzhanova
 * Date: 2025-10-27
 */
package ecommerce.store;

import java.util.ArrayList;
import java.util.List;
import ecommerce.models.*;

public class Store {
    private List<User> users = new ArrayList<>();
    private List<Product> products = new ArrayList<>();
    private List<Order> orders = new ArrayList<>();
    private int nextProductId = 1;
    private int nextOrderId = 1;

    // Seed data for demo
    public void seed() {
        // Employees
        users.add(new Employee("Admin", "admin@shop.com", "admin123", "Manager"));
        // Customers
        users.add(new Customer("Alice", "alice@mail.com", "1234", "Petropavl, KZ"));
        users.add(new Customer("Bob", "bob@mail.com", "1234", "Almaty, KZ"));

        // Products
        addProduct(new Book(0, "Clean Code", 35.99, 10, "Robert C. Martin", "Programming"));
        addProduct(new Electronics(0, "Smartphone X", 499.0, 5, "Acme", 24));
        addProduct(new Clothing(0, "Hoodie Classic", 29.5, 20, "M", "Cotton"));
    }

    public void addUser(User user) {
        users.add(user);
    }

    public List<User> getUsers() { return users; }

    public User findUserByEmail(String email) {
        for (User u : users) {
            if (u.getEmail().equalsIgnoreCase(email)) return u;
        }
        return null;
    }

    public void addProduct(Product product) {
        // assign id
        try {
            java.lang.reflect.Method setter = product.getClass().getSuperclass().getDeclaredMethod("setId", int.class);
            setter.setAccessible(true);
            setter.invoke(product, nextProductId++);
        } catch (Exception e) {
            // fallback for reflection issues
        }
        products.add(product);
    }

    public List<Product> getProducts() { return products; }

    public Product findProductById(int id) {
        for (Product p : products) {
            if (p.getId() == id) return p;
        }
        return null;
    }

    public void addOrder(Order order) {
        orders.add(order);
    }

    public List<Order> getOrders() { return orders; }

    public int nextOrderId() { return nextOrderId++; }
}

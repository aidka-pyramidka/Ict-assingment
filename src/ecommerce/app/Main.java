/** 
 * Console-based E-Commerce System (Assignment 1)
 * Author: Aida Alimzhanova
 * Date: 2025-10-13
 */
package ecommerce.app;

import java.util.List;
import java.util.Scanner;

import ecommerce.models.*;
import ecommerce.store.Store;

public class Main {
    private static final Scanner scanner = new Scanner(System.in);
    private static final Store store = new Store();

    public static void main(String[] args) {
        store.seed();
        System.out.println("=== Console E-Commerce System ===");
        boolean running = true;
        while (running) {
            System.out.println("\n1) Login as Customer");
            System.out.println("2) Login as Employee");
            System.out.println("3) Continue as Guest (browse only)");
            System.out.println("0) Exit");
            System.out.print("Choose: ");
            String choice = scanner.nextLine();

            switch (choice) {
                case "1":
                    Customer customer = loginCustomer();
                    if (customer != null) customerMenu(customer);
                    break;
                case "2":
                    Employee employee = loginEmployee();
                    if (employee != null) employeeMenu(employee);
                    break;
                case "3":
                    browseProducts();
                    break;
                case "0":
                    running = false;
                    break;
                default:
                    System.out.println("Invalid choice.");
            }
        }
        System.out.println("Goodbye!");
    }

    private static Customer loginCustomer() {
        System.out.print("Email: ");
        String email = scanner.nextLine();
        System.out.print("Password: ");
        String pwd = scanner.nextLine();

        User u = store.findUserByEmail(email);
        if (u instanceof Customer && u.getPassword().equals(pwd)) {
            System.out.println("Welcome, " + u.getName() + "!");
            return (Customer) u;
        }
        System.out.println("Invalid credentials or not a customer.");
        return null;
    }

    private static Employee loginEmployee() {
        System.out.print("Email: ");
        String email = scanner.nextLine();
        System.out.print("Password: ");
        String pwd = scanner.nextLine();

        User u = store.findUserByEmail(email);
        if (u instanceof Employee && u.getPassword().equals(pwd)) {
            System.out.println("Welcome, " + u.getName() + "!");
            return (Employee) u;
        }
        System.out.println("Invalid credentials or not an employee.");
        return null;
    }

    private static void customerMenu(Customer customer) {
        boolean back = false;
        while (!back) {
            System.out.println("\n--- Customer Menu ---");
            System.out.println("1) List products");
            System.out.println("2) Place order");
            System.out.println("3) View my orders");
            System.out.println("0) Logout");
            System.out.print("Choose: ");
            String ch = scanner.nextLine();
            switch (ch) {
                case "1":
                    browseProducts();
                    break;
                case "2":
                    placeOrder(customer);
                    break;
                case "3":
                    viewOrdersForCustomer(customer);
                    break;
                case "0":
                    back = true;
                    break;
                default:
                    System.out.println("Invalid choice.");
            }
        }
    }

    private static void employeeMenu(Employee employee) {
        boolean back = false;
        while (!back) {
            System.out.println("\n--- Employee Menu ---");
            System.out.println("1) List products");
            System.out.println("2) Add product");
            System.out.println("3) List users");
            System.out.println("4) Add user");
            System.out.println("5) View all orders");
            System.out.println("0) Logout");
            System.out.print("Choose: ");
            String ch = scanner.nextLine();
            switch (ch) {
                case "1":
                    browseProducts();
                    break;
                case "2":
                    addProductFlow();
                    break;
                case "3":
                    listUsers();
                    break;
                case "4":
                    addUserFlow();
                    break;
                case "5":
                    viewAllOrders();
                    break;
                case "0":
                    back = true;
                    break;
                default:
                    System.out.println("Invalid choice.");
            }
        }
    }

    private static void browseProducts() {
        System.out.println("\n--- Products ---");
        for (Product p : store.getProducts()) {
            p.displayInfo();
        }
    }

    private static void addProductFlow() {
        System.out.println("\nChoose product type:");
        System.out.println("1) Book");
        System.out.println("2) Electronics");
        System.out.println("3) Clothing");
        System.out.print("Type: ");
        String type = scanner.nextLine();

        System.out.print("Name: ");
        String name = scanner.nextLine();
        System.out.print("Price: ");
        double price = Double.parseDouble(scanner.nextLine());
        System.out.print("Stock quantity: ");
        int stock = Integer.parseInt(scanner.nextLine());

        switch (type) {
            case "1":
                System.out.print("Author: ");
                String author = scanner.nextLine();
                System.out.print("Genre: ");
                String genre = scanner.nextLine();
                store.addProduct(new Book(0, name, price, stock, author, genre));
                break;
            case "2":
                System.out.print("Brand: ");
                String brand = scanner.nextLine();
                System.out.print("Warranty months: ");
                int wm = Integer.parseInt(scanner.nextLine());
                store.addProduct(new Electronics(0, name, price, stock, brand, wm));
                break;
            case "3":
                System.out.print("Size: ");
                String size = scanner.nextLine();
                System.out.print("Material: ");
                String material = scanner.nextLine();
                store.addProduct(new Clothing(0, name, price, stock, size, material));
                break;
            default:
                System.out.println("Unknown type.");
                return;
        }
        System.out.println("Product added.");
    }

    private static void listUsers() {
        System.out.println("\n--- Users ---");
        for (User u : store.getUsers()) {
            u.displayInfo();
        }
    }

    private static void addUserFlow() {
        System.out.println("\nAdd user type:");
        System.out.println("1) Customer");
        System.out.println("2) Employee");
        System.out.print("Type: ");
        String type = scanner.nextLine();

        System.out.print("Name: ");
        String name = scanner.nextLine();
        System.out.print("Email: ");
        String email = scanner.nextLine();
        System.out.print("Password: ");
        String pwd = scanner.nextLine();

        switch (type) {
            case "1":
                System.out.print("Address: ");
                String address = scanner.nextLine();
                store.addUser(new Customer(name, email, pwd, address));
                break;
            case "2":
                System.out.print("Position: ");
                String position = scanner.nextLine();
                store.addUser(new Employee(name, email, pwd, position));
                break;
            default:
                System.out.println("Unknown type.");
                return;
        }
        System.out.println("User added.");
    }

    private static void placeOrder(Customer customer) {
        Order order = new Order(store.nextOrderId(), customer);
        while (true) {
            browseProducts();
            System.out.print("Enter product ID to add (0 to finish): ");
            int id = Integer.parseInt(scanner.nextLine());
            if (id == 0) break;
            Product p = store.findProductById(id);
            if (p == null) {
                System.out.println("Product not found.");
                continue;
            }
            System.out.print("Quantity: ");
            int qty = Integer.parseInt(scanner.nextLine());
            if (qty <= 0) {
                System.out.println("Invalid quantity.");
                continue;
            }
            if (p.getStockQuantity() < qty) {
                System.out.println("Not enough stock.");
                continue;
            }
            p.reduceStock(qty);
            order.addItem(p, qty);
            System.out.println("Added to order.");
        }
        if (order.getItems().isEmpty()) {
            System.out.println("No items. Order cancelled.");
            return;
        }
        store.addOrder(order);
        order.printReceipt();
    }

    private static void viewOrdersForCustomer(Customer customer) {
        System.out.println("\n--- Your Orders ---");
        boolean any = false;
        for (Order o : store.getOrders()) {
            if (o.getCustomer().getEmail().equalsIgnoreCase(customer.getEmail())) {
                any = true;
                o.printReceipt();
            }
        }
        if (!any) System.out.println("No orders yet.");
    }

    private static void viewAllOrders() {
        System.out.println("\n--- All Orders ---");
        List<Order> orders = store.getOrders();
        if (orders.isEmpty()) {
            System.out.println("No orders yet.");
            return;
        }
        for (Order o : orders) {
            o.printReceipt();
        }
    }
}

/** 
 * Book extends Product
 * Author: Aida Alimzhanova
 * Date: 2025-10-27
 */
package ecommerce.models;

public class Book extends Product {
    private String author;
    private String genre;

    public Book(int id, String name, double price, int stockQuantity, String author, String genre) {
        super(id, name, price, stockQuantity);
        this.author = author;
        this.genre = genre;
    }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    @Override
    public void displayInfo() {
        System.out.printf("Book [ID:%d] %s by %s | Genre: %s | Price: %.2f | Stock: %d\n",
            getId(), getName(), author, genre, getPrice(), getStockQuantity());
    }
}

package com.cartflow;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class CartflowApplication {

    public static void main(String[] args) {
        SpringApplication.run(CartflowApplication.class, args);
    }

    @Bean
    public CommandLineRunner migrateDatabase(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE products DROP COLUMN category");
                System.out.println("Successfully migrated database: dropped old 'category' column.");
            } catch (Exception e) {
                System.out.println("Database migration info: " + e.getMessage());
            }

            try {
                jdbcTemplate.execute("INSERT IGNORE INTO categories (name) VALUES ('Outerwear'), ('Footwear'), ('Accessories'), ('Apparel'), ('Electronics')");
                System.out.println("Successfully seeded default categories.");
            } catch (Exception e) {
                System.out.println("Database seeding info: " + e.getMessage());
            }
        };
    }
}

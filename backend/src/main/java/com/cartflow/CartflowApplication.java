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
                jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");
                jdbcTemplate.execute("TRUNCATE TABLE categories");
                jdbcTemplate.execute("INSERT INTO categories (id, name) VALUES " +
                        "(1, 'Electronics'), " +
                        "(2, 'Fashion'), " +
                        "(3, 'Footwear'), " +
                        "(4, 'Accessories'), " +
                        "(5, 'Home & Kitchen'), " +
                        "(6, 'Grocery')");
                jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1");
                System.out.println("Successfully seeded default categories (1-6).");
            } catch (Exception e) {
                System.out.println("Database seeding info: " + e.getMessage());
            }
        };
    }
}

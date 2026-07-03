package com.cartflow.service;

import com.cartflow.entity.Category;
import com.cartflow.entity.Product;
import com.cartflow.exception.ResourceNotFoundException;
import com.cartflow.repository.CategoryRepository;
import com.cartflow.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Page<Product> getFilteredProducts(String search, Long categoryId, Double minPrice, Double maxPrice, Boolean inStock, Pageable pageable) {
        Specification<Product> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate namePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern);
                Predicate skuPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("sku")), searchPattern);
                predicates.add(criteriaBuilder.or(namePredicate, skuPredicate));
            }

            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), categoryId));
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.ge(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.le(root.get("price"), maxPrice));
            }

            if (inStock != null) {
                if (inStock) {
                    predicates.add(criteriaBuilder.gt(root.get("quantity"), 0));
                } else {
                    predicates.add(criteriaBuilder.equal(root.get("quantity"), 0));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec, pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    public Product createProduct(Product product) {
        if (productRepository.existsBySku(product.getSku())) {
            throw new IllegalArgumentException("Product with SKU '" + product.getSku() + "' already exists");
        }
        
        // Ensure category exists if ID is provided
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", product.getCategory().getId()));
            product.setCategory(category);
        }
        
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);

        if (productRepository.existsBySkuAndIdNot(productDetails.getSku(), id)) {
            throw new IllegalArgumentException("Product with SKU '" + productDetails.getSku() + "' already exists");
        }

        product.setName(productDetails.getName());
        product.setSku(productDetails.getSku());
        product.setPrice(productDetails.getPrice());
        product.setQuantity(productDetails.getQuantity());
        product.setImageUrl(productDetails.getImageUrl());

        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            Category category = categoryRepository.findById(productDetails.getCategory().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", productDetails.getCategory().getId()));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}

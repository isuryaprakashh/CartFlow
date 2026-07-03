package com.cartflow.service;

import com.cartflow.entity.Product;
import com.cartflow.entity.SavedItem;
import com.cartflow.entity.User;
import com.cartflow.exception.ResourceNotFoundException;
import com.cartflow.repository.ProductRepository;
import com.cartflow.repository.SavedItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SavedItemService {

    private final SavedItemRepository savedItemRepository;
    private final ProductRepository productRepository;

    public SavedItemService(SavedItemRepository savedItemRepository, ProductRepository productRepository) {
        this.savedItemRepository = savedItemRepository;
        this.productRepository = productRepository;
    }

    public List<SavedItem> getSavedItems(User user) {
        return savedItemRepository.findByUserId(user.getId());
    }

    public SavedItem saveForLater(User user, Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        Optional<SavedItem> existing = savedItemRepository.findByUserIdAndProductId(user.getId(), productId);
        if (existing.isPresent()) {
            SavedItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return savedItemRepository.save(item);
        }

        SavedItem item = new SavedItem();
        item.setUser(user);
        item.setProduct(product);
        item.setQuantity(quantity);
        return savedItemRepository.save(item);
    }

    public void removeSavedItem(User user, Long id) {
        SavedItem item = savedItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Saved item", id));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorized to remove this item");
        }

        savedItemRepository.delete(item);
    }
}

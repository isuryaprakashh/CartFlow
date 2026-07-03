package com.cartflow.controller;

import com.cartflow.entity.SavedItem;
import com.cartflow.entity.User;
import com.cartflow.repository.UserRepository;
import com.cartflow.service.SavedItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved")
public class SavedItemController {

    private final SavedItemService savedItemService;
    private final UserRepository userRepository;

    public SavedItemController(SavedItemService savedItemService, UserRepository userRepository) {
        this.savedItemService = savedItemService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<SavedItem>> getSavedItems() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(savedItemService.getSavedItems(user));
    }

    @PostMapping("/add")
    public ResponseEntity<SavedItem> saveForLater(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Long productId = Long.valueOf(body.get("productId").toString());
        Integer quantity = Integer.valueOf(body.get("quantity").toString());
        SavedItem item = savedItemService.saveForLater(user, productId, quantity);
        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Void> removeSavedItem(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        savedItemService.removeSavedItem(user, id);
        return ResponseEntity.noContent().build();
    }
}

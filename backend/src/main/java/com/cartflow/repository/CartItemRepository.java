package com.cartflow.repository;

import com.cartflow.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);
    void deleteByUserId(Long userId);
    List<CartItem> findByProductId(Long productId);
    List<CartItem> findByReservedAtBefore(java.time.LocalDateTime dateTime);
}

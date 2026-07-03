package com.cartflow.repository;

import com.cartflow.entity.SavedItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedItemRepository extends JpaRepository<SavedItem, Long> {
    List<SavedItem> findByUserId(Long userId);
    Optional<SavedItem> findByUserIdAndProductId(Long userId, Long productId);
}

package com.cartflow.service;

import com.cartflow.entity.*;
import com.cartflow.exception.ResourceNotFoundException;
import com.cartflow.repository.CouponRepository;
import com.cartflow.repository.OrderRepository;
import com.cartflow.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;

    public OrderService(OrderRepository orderRepository,
                        CartService cartService,
                        ProductRepository productRepository,
                        CouponRepository couponRepository) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
    }

    public List<Order> getOrderHistory(User user) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId());
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    }

    @Transactional
    public Order createOrder(User user, String shippingAddress, String phoneNumber, String couponCode) {
        List<CartItem> cartItems = cartService.getCartItems(user);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cannot place order with an empty cart");
        }

        // Validate stock for all items
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (product.getQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException("Not enough stock for product: " + product.getName() + 
                        ". Available: " + product.getQuantity() + ", Requested: " + item.getQuantity());
            }
        }

        // Calculate total
        double subtotal = cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        Coupon coupon = null;
        double discount = 0.0;
        if (couponCode != null && !couponCode.trim().isEmpty()) {
            try {
                coupon = couponRepository.findByCode(couponCode.trim().toUpperCase())
                        .orElse(null);
                if (coupon != null && coupon.getActive()) {
                    if (coupon.getDiscountType().equalsIgnoreCase("PERCENTAGE")) {
                        discount = subtotal * (coupon.getDiscountAmount() / 100.0);
                    } else {
                        discount = coupon.getDiscountAmount();
                    }
                }
            } catch (Exception e) {
                logger.warn("Could not validate coupon code: {}", couponCode);
            }
        }

        double totalAmount = Math.max(0.0, subtotal - discount);

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setTotalAmount(totalAmount);
        order.setCoupon(coupon);
        order.setShippingAddress(shippingAddress);
        order.setPhoneNumber(phoneNumber);

        // Map cart items to order items and update product stock
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            // Deduct stock
            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(product.getPrice());
            order.getItems().add(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        // Clear cart
        cartService.clearCart(user);

        // Mock confirmation email / log
        logger.info("[Order Placed Log] Order ID {} created for user {}. Total Amount: ${}. Address: {}.",
                savedOrder.getId(), user.getUsername(), savedOrder.getTotalAmount(), shippingAddress);

        return savedOrder;
    }

    public Order updateOrderStatus(Long orderId, String status) {
        Order order = getOrderById(orderId);
        order.setStatus(status.toUpperCase());
        Order updated = orderRepository.save(order);
        logger.info("[Order Log] Order ID {} status updated to: {}", orderId, status);
        return updated;
    }
}

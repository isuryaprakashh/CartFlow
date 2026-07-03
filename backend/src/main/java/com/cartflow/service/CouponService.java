package com.cartflow.service;

import com.cartflow.entity.Coupon;
import com.cartflow.exception.ResourceNotFoundException;
import com.cartflow.repository.CouponRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Coupon getCouponById(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", id));
    }

    public Coupon getCouponByCode(String code) {
        return couponRepository.findByCode(code.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Coupon with code '" + code + "' not found"));
    }

    public Coupon createCoupon(Coupon coupon) {
        coupon.setCode(coupon.getCode().trim().toUpperCase());
        if (couponRepository.findByCode(coupon.getCode()).isPresent()) {
            throw new IllegalArgumentException("Coupon code '" + coupon.getCode() + "' already exists");
        }
        return couponRepository.save(coupon);
    }

    public Coupon updateCoupon(Long id, Coupon couponDetails) {
        Coupon coupon = getCouponById(id);
        coupon.setDiscountAmount(couponDetails.getDiscountAmount());
        coupon.setDiscountType(couponDetails.getDiscountType());
        coupon.setExpiryDate(couponDetails.getExpiryDate());
        coupon.setActive(couponDetails.getActive());
        return couponRepository.save(coupon);
    }

    public void deleteCoupon(Long id) {
        Coupon coupon = getCouponById(id);
        couponRepository.delete(coupon);
    }

    public Coupon validateCoupon(String code) {
        Coupon coupon = getCouponByCode(code);
        if (!coupon.getActive()) {
            throw new IllegalArgumentException("Coupon is inactive");
        }
        if (coupon.getExpiryDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Coupon has expired");
        }
        return coupon;
    }
}

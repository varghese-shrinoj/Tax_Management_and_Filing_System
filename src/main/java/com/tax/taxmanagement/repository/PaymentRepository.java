package com.tax.taxmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tax.taxmanagement.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("SELECT COALESCE(SUM(p.amount),0) FROM Payment p")
    Double getTotalRevenue();

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.taxFiling.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.taxFiling.user.id = :userId AND p.taxFiling.filingType = :filingType")
    long countByUserIdAndFilingType(@Param("userId") Long userId, @Param("filingType") String filingType);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.taxFiling.filingType = :filingType")
    long countByFilingType(@Param("filingType") String filingType);

}
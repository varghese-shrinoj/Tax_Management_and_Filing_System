package com.tax.taxmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tax.taxmanagement.entity.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    @Query("SELECT COUNT(d) FROM Document d WHERE d.taxFiling.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(d) FROM Document d WHERE d.taxFiling.user.id = :userId AND d.taxFiling.filingType = :filingType")
    long countByUserIdAndFilingType(@Param("userId") Long userId, @Param("filingType") String filingType);

}
package com.tax.taxmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tax.taxmanagement.entity.TaxFiling;

@Repository
public interface TaxFilingRepository extends JpaRepository<TaxFiling, Long> {
	List<TaxFiling> findByStatus(String status);
	List<TaxFiling> findByFinancialYear(String financialYear);
	List<TaxFiling> findByUserId(Long userId);
	List<TaxFiling> findByTaxTypeId(Long taxTypeId);
	long countByUserId(Long userId);
	long countByUserIdAndFilingType(Long userId, String filingType);
	long countByFilingType(String filingType);
}
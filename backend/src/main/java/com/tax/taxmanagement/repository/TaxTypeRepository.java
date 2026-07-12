package com.tax.taxmanagement.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tax.taxmanagement.entity.TaxType;

@Repository
public interface TaxTypeRepository extends JpaRepository<TaxType, Long>{
	List<TaxType> findByTaxNameContainingIgnoreCase(String taxName);

}
package com.tax.taxmanagement.service;

import java.util.List;

import com.tax.taxmanagement.dto.TaxFilingRequest;
import com.tax.taxmanagement.entity.TaxFiling;

public interface TaxFilingService {

	TaxFiling createTaxFiling(TaxFilingRequest request);

	TaxFiling updateTaxFiling(Long id, TaxFilingRequest request);

    List<TaxFiling> getAllTaxFilings();

    TaxFiling getTaxFilingById(Long id);

   

    void deleteTaxFiling(Long id);
    List<TaxFiling> getByStatus(String status);

    List<TaxFiling> getByFinancialYear(String year);

    List<TaxFiling> getByUser(Long userId);

    List<TaxFiling> getByTaxType(Long taxTypeId);

}
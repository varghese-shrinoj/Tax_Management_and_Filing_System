package com.tax.taxmanagement.service;

import java.util.List;

import com.tax.taxmanagement.entity.TaxType;

public interface TaxTypeService {

    TaxType addTaxType(TaxType taxType);

    List<TaxType> getAllTaxTypes();

    TaxType getTaxTypeById(Long id);

    TaxType updateTaxType(Long id, TaxType taxType);

    void deleteTaxType(Long id);
    List<TaxType> searchTaxTypes(String taxName);

}
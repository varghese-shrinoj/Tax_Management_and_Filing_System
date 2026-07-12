package com.tax.taxmanagement.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tax.taxmanagement.entity.TaxType;
import com.tax.taxmanagement.repository.TaxTypeRepository;
import com.tax.taxmanagement.service.TaxTypeService;

@Service
public class TaxTypeServiceImpl implements TaxTypeService {

    @Autowired
    private TaxTypeRepository taxTypeRepository;

    @Override
    public TaxType addTaxType(TaxType taxType) {
        return taxTypeRepository.save(taxType);
    }

    @Override
    public List<TaxType> getAllTaxTypes() {
        return taxTypeRepository.findAll();
    }

    @Override
    public TaxType getTaxTypeById(Long id) {
        return taxTypeRepository.findById(id).orElse(null);
    }

    @Override
    public TaxType updateTaxType(Long id, TaxType taxType) {

        TaxType existingTaxType = taxTypeRepository.findById(id).orElse(null);

        if (existingTaxType != null) {
            existingTaxType.setTaxName(taxType.getTaxName());
            existingTaxType.setDescription(taxType.getDescription());

            return taxTypeRepository.save(existingTaxType);
        }

        return null;
    }

    @Override
    public void deleteTaxType(Long id) {
        taxTypeRepository.deleteById(id);
    }
    
    @Override
    public List<TaxType> searchTaxTypes(String taxName) {
        return taxTypeRepository.findByTaxNameContainingIgnoreCase(taxName);
    }
}
package com.tax.taxmanagement.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tax.taxmanagement.dto.TaxFilingRequest;
import com.tax.taxmanagement.entity.TaxFiling;
import com.tax.taxmanagement.entity.TaxType;
import com.tax.taxmanagement.entity.User;
import com.tax.taxmanagement.repository.TaxFilingRepository;
import com.tax.taxmanagement.repository.TaxTypeRepository;
import com.tax.taxmanagement.repository.UserRepository;
import com.tax.taxmanagement.service.TaxFilingService;

@Service
public class TaxFilingServiceImpl implements TaxFilingService {

    @Autowired 	
    private TaxFilingRepository taxFilingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaxTypeRepository taxTypeRepository;

    @Override
    public TaxFiling createTaxFiling(TaxFilingRequest request) {

        User user = userRepository.findById(request.getUserId()).orElse(null);

        TaxType taxType = taxTypeRepository.findById(request.getTaxTypeId()).orElse(null);

        TaxFiling taxFiling = new TaxFiling();

        taxFiling.setFinancialYear(request.getFinancialYear());
        taxFiling.setAnnualIncome(request.getAnnualIncome());
        taxFiling.setTaxAmount(request.getTaxAmount());
        taxFiling.setFilingDate(request.getFilingDate());
        taxFiling.setStatus(request.getStatus());
        taxFiling.setFilingType(request.getFilingType());
        taxFiling.setOrganizationName(request.getOrganizationName());
        taxFiling.setFeedback(request.getFeedback());

        taxFiling.setUser(user);
        taxFiling.setTaxType(taxType);

        return taxFilingRepository.save(taxFiling);
    }

    @Override
    public List<TaxFiling> getAllTaxFilings() {
        return taxFilingRepository.findAll();
    }

    @Override
    public TaxFiling getTaxFilingById(Long id) {
        return taxFilingRepository.findById(id).orElse(null);
    }

    @Override
    public TaxFiling updateTaxFiling(Long id, TaxFilingRequest request) {

        TaxFiling existingTaxFiling = taxFilingRepository.findById(id).orElse(null);

        if (existingTaxFiling == null) {
            return null;
        }

        User user = userRepository.findById(request.getUserId()).orElse(null);

        TaxType taxType = taxTypeRepository.findById(request.getTaxTypeId()).orElse(null);

        existingTaxFiling.setFinancialYear(request.getFinancialYear());
        existingTaxFiling.setAnnualIncome(request.getAnnualIncome());
        existingTaxFiling.setTaxAmount(request.getTaxAmount());
        existingTaxFiling.setFilingDate(request.getFilingDate());
        existingTaxFiling.setStatus(request.getStatus());
        existingTaxFiling.setFilingType(request.getFilingType());
        existingTaxFiling.setOrganizationName(request.getOrganizationName());
        existingTaxFiling.setFeedback(request.getFeedback());

        existingTaxFiling.setUser(user);
        existingTaxFiling.setTaxType(taxType);

        return taxFilingRepository.save(existingTaxFiling);
    }

    @Override
    public void deleteTaxFiling(Long id) {
        taxFilingRepository.deleteById(id);
    }
    
    @Override
    public List<TaxFiling> getByStatus(String status) {
        return taxFilingRepository.findByStatus(status);
    }

    @Override
    public List<TaxFiling> getByFinancialYear(String year) {
        return taxFilingRepository.findByFinancialYear(year);
    }

    @Override
    public List<TaxFiling> getByUser(Long userId) {
        return taxFilingRepository.findByUserId(userId);
    }

    @Override
    public List<TaxFiling> getByTaxType(Long taxTypeId) {
        return taxFilingRepository.findByTaxTypeId(taxTypeId);
    }
}
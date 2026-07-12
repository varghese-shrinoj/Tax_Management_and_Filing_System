package com.tax.taxmanagement.controller;
import com.tax.taxmanagement.dto.TaxFilingRequest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.tax.taxmanagement.entity.TaxFiling;
import com.tax.taxmanagement.service.TaxFilingService;

@RestController
@RequestMapping("/api/tax-filings")
@CrossOrigin("*")
public class TaxFilingController {

    @Autowired
    private TaxFilingService taxFilingService;

    @PostMapping
    public TaxFiling createTaxFiling(@RequestBody TaxFilingRequest request) {
        return taxFilingService.createTaxFiling(request);
    }

    @GetMapping
    public List<TaxFiling> getAllTaxFilings() {
        return taxFilingService.getAllTaxFilings();
    }

    @GetMapping("/{id}")
    public TaxFiling getTaxFilingById(@PathVariable Long id) {
        return taxFilingService.getTaxFilingById(id);
    }

    @PutMapping("/{id}")
    public TaxFiling updateTaxFiling(@PathVariable Long id,
                                     @RequestBody TaxFilingRequest request) {

        return taxFilingService.updateTaxFiling(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteTaxFiling(@PathVariable Long id) {
        taxFilingService.deleteTaxFiling(id);
        return "Tax Filing Deleted Successfully";
    }

    @PostMapping("/{id}/approve")
    public TaxFiling approveFiling(@PathVariable Long id) {
        TaxFiling filing = taxFilingService.getTaxFilingById(id);
        if (filing != null) {
            filing.setStatus("APPROVED");
            filing.setFeedback(null);
            TaxFilingRequest req = new TaxFilingRequest();
            req.setFinancialYear(filing.getFinancialYear());
            req.setAnnualIncome(filing.getAnnualIncome());
            req.setTaxAmount(filing.getTaxAmount());
            req.setFilingDate(filing.getFilingDate());
            req.setStatus("APPROVED");
            req.setFilingType(filing.getFilingType());
            req.setOrganizationName(filing.getOrganizationName());
            req.setFeedback(null);
            req.setUserId(filing.getUser() != null ? filing.getUser().getId() : null);
            req.setTaxTypeId(filing.getTaxType() != null ? filing.getTaxType().getId() : null);
            return taxFilingService.updateTaxFiling(id, req);
        }
        return null;
    }

    @PostMapping("/{id}/reject")
    public TaxFiling rejectFiling(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        TaxFiling filing = taxFilingService.getTaxFilingById(id);
        if (filing != null) {
            TaxFilingRequest req = new TaxFilingRequest();
            req.setFinancialYear(filing.getFinancialYear());
            req.setAnnualIncome(filing.getAnnualIncome());
            req.setTaxAmount(filing.getTaxAmount());
            req.setFilingDate(filing.getFilingDate());
            req.setStatus("REJECTED");
            req.setFilingType(filing.getFilingType());
            req.setOrganizationName(filing.getOrganizationName());
            req.setFeedback(body.get("feedback"));
            req.setUserId(filing.getUser() != null ? filing.getUser().getId() : null);
            req.setTaxTypeId(filing.getTaxType() != null ? filing.getTaxType().getId() : null);
            return taxFilingService.updateTaxFiling(id, req);
        }
        return null;
    }

    @PostMapping("/{id}/submit")
    public TaxFiling submitFiling(@PathVariable Long id) {
        TaxFiling filing = taxFilingService.getTaxFilingById(id);
        if (filing != null) {
            TaxFilingRequest req = new TaxFilingRequest();
            req.setFinancialYear(filing.getFinancialYear());
            req.setAnnualIncome(filing.getAnnualIncome());
            req.setTaxAmount(filing.getTaxAmount());
            req.setFilingDate(filing.getFilingDate());
            req.setStatus("PENDING");
            req.setFilingType(filing.getFilingType());
            req.setOrganizationName(filing.getOrganizationName());
            req.setFeedback(null);
            req.setUserId(filing.getUser() != null ? filing.getUser().getId() : null);
            req.setTaxTypeId(filing.getTaxType() != null ? filing.getTaxType().getId() : null);
            return taxFilingService.updateTaxFiling(id, req);
        }
        return null;
    }
}
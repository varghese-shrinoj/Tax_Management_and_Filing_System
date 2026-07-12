package com.tax.taxmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.tax.taxmanagement.entity.TaxFiling;
import com.tax.taxmanagement.entity.TaxType;
import com.tax.taxmanagement.service.TaxFilingService;
import com.tax.taxmanagement.service.TaxTypeService;

@RestController
@RequestMapping("/api/tax-types")
@CrossOrigin("*")
public class TaxTypeController {

    @Autowired
    private TaxTypeService taxTypeService;

    @Autowired
    private TaxFilingService taxFilingService;

    @PostMapping
    public TaxType addTaxType(@RequestBody TaxType taxType) {
        return taxTypeService.addTaxType(taxType);
    }

    @GetMapping
    public List<TaxType> getAllTaxTypes() {
        return taxTypeService.getAllTaxTypes();
    }

    @GetMapping("/{id}")
    public TaxType getTaxTypeById(@PathVariable Long id) {
        return taxTypeService.getTaxTypeById(id);
    }

    @PutMapping("/{id}")
    public TaxType updateTaxType(@PathVariable Long id,
                                 @RequestBody TaxType taxType) {
        return taxTypeService.updateTaxType(id, taxType);
    }

    @DeleteMapping("/{id}")
    public String deleteTaxType(@PathVariable Long id) {
        taxTypeService.deleteTaxType(id);
        return "Tax Type Deleted Successfully";
    }
    @GetMapping("/search")
    public List<TaxType> searchTaxTypes(@RequestParam String name) {
        return taxTypeService.searchTaxTypes(name);
    }
    
    
    @GetMapping("/status")
    public List<TaxFiling> getByStatus(@RequestParam String status) {
        return taxFilingService.getByStatus(status);
    }

    @GetMapping("/year")
    public List<TaxFiling> getByFinancialYear(@RequestParam String year) {
        return taxFilingService.getByFinancialYear(year);
    }

    @GetMapping("/user/{id}")
    public List<TaxFiling> getByUser(@PathVariable Long id) {
        return taxFilingService.getByUser(id);
    }

    @GetMapping("/tax-type/{id}")
    public List<TaxFiling> getByTaxType(@PathVariable Long id) {
        return taxFilingService.getByTaxType(id);
    }
}
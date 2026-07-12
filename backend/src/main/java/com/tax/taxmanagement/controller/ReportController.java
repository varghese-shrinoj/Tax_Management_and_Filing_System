package com.tax.taxmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.tax.taxmanagement.dto.ReportResponse;
import com.tax.taxmanagement.service.ReportService;
import java.util.List;

import com.tax.taxmanagement.entity.Document;
import com.tax.taxmanagement.entity.Payment;
import com.tax.taxmanagement.entity.TaxFiling;
import com.tax.taxmanagement.entity.User;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/summary")
    public ReportResponse getSummaryReport() {
        return reportService.getSummaryReport();
    }
    
    @GetMapping("/users")
    public List<User> getUsersReport() {
        return reportService.getUsersReport();
    }

    @GetMapping("/tax-filings")
    public List<TaxFiling> getTaxFilingsReport() {
        return reportService.getTaxFilingsReport();
    }

    @GetMapping("/payments")
    public List<Payment> getPaymentsReport() {
        return reportService.getPaymentsReport();
    }

    @GetMapping("/documents")
    public List<Document> getDocumentsReport() {
        return reportService.getDocumentsReport();
    }

    @GetMapping("/revenue")
    public Double getRevenueReport() {
        return reportService.getRevenueReport();
    }
}
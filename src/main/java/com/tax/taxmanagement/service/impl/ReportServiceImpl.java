package com.tax.taxmanagement.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tax.taxmanagement.dto.ReportResponse;
import com.tax.taxmanagement.entity.Document;
import com.tax.taxmanagement.entity.Payment;
import com.tax.taxmanagement.entity.TaxFiling;
import com.tax.taxmanagement.entity.User;
import com.tax.taxmanagement.repository.DocumentRepository;
import com.tax.taxmanagement.repository.PaymentRepository;
import com.tax.taxmanagement.repository.TaxFilingRepository;
import com.tax.taxmanagement.repository.UserRepository;
import com.tax.taxmanagement.service.ReportService;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaxFilingRepository taxFilingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Override
    public ReportResponse getSummaryReport() {

        ReportResponse report = new ReportResponse();

        report.setTotalUsers(userRepository.count());
        report.setTotalTaxFilings(taxFilingRepository.count());
        report.setTotalPayments(paymentRepository.count());
        report.setTotalDocuments(documentRepository.count());

        Double revenue = paymentRepository.getTotalRevenue();
        report.setTotalRevenue(revenue);

        return report;
    }

    @Override
    public List<User> getUsersReport() {
        return userRepository.findAll();
    }

    @Override
    public List<TaxFiling> getTaxFilingsReport() {
        return taxFilingRepository.findAll();
    }

    @Override
    public List<Payment> getPaymentsReport() {
        return paymentRepository.findAll();
    }

    @Override
    public List<Document> getDocumentsReport() {
        return documentRepository.findAll();
    }

    @Override
    public Double getRevenueReport() {
        return paymentRepository.getTotalRevenue();
    }
}
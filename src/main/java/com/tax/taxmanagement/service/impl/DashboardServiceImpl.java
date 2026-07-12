package com.tax.taxmanagement.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tax.taxmanagement.dto.DashboardResponse;
import com.tax.taxmanagement.repository.DocumentRepository;
import com.tax.taxmanagement.repository.PaymentRepository;
import com.tax.taxmanagement.repository.TaxFilingRepository;
import com.tax.taxmanagement.repository.UserRepository;
import com.tax.taxmanagement.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaxFilingRepository taxFilingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Override
    public DashboardResponse getDashboard() {

        DashboardResponse response = new DashboardResponse();

        response.setTotalUsers(userRepository.count());
        response.setTotalTaxFilings(taxFilingRepository.count());
        response.setTotalPayments(paymentRepository.count());
        response.setTotalDocuments(documentRepository.count());

        // Admin separated counts
        response.setTotalIndividualFilings(taxFilingRepository.countByFilingType("INDIVIDUAL"));
        response.setTotalOrganizationFilings(taxFilingRepository.countByFilingType("ORGANIZATION"));
        response.setTotalIndividualPayments(paymentRepository.countByFilingType("INDIVIDUAL"));
        response.setTotalOrganizationPayments(paymentRepository.countByFilingType("ORGANIZATION"));

        return response;
    }

    @Override
    public DashboardResponse getDashboardForUser(Long userId) {

        DashboardResponse response = new DashboardResponse();

        response.setTotalUsers(0L); // Or null, not applicable for a regular user

        // Maintain total counts for the user
        response.setTotalTaxFilings(taxFilingRepository.countByUserId(userId));
        response.setTotalPayments(paymentRepository.countByUserId(userId));
        response.setTotalDocuments(documentRepository.countByUserId(userId));

        // Separated user counts
        response.setTotalIndividualFilings(taxFilingRepository.countByUserIdAndFilingType(userId, "INDIVIDUAL"));
        response.setTotalOrganizationFilings(taxFilingRepository.countByUserIdAndFilingType(userId, "ORGANIZATION"));
        response.setTotalIndividualPayments(paymentRepository.countByUserIdAndFilingType(userId, "INDIVIDUAL"));
        response.setTotalOrganizationPayments(paymentRepository.countByUserIdAndFilingType(userId, "ORGANIZATION"));

        return response;
    }
}
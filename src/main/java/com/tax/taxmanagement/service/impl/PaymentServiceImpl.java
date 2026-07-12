package com.tax.taxmanagement.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tax.taxmanagement.dto.PaymentRequest;
import com.tax.taxmanagement.entity.Payment;
import com.tax.taxmanagement.entity.TaxFiling;
import com.tax.taxmanagement.repository.PaymentRepository;
import com.tax.taxmanagement.repository.TaxFilingRepository;
import com.tax.taxmanagement.service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TaxFilingRepository taxFilingRepository;

    @Override
    public Payment createPayment(PaymentRequest request) {

        TaxFiling taxFiling = taxFilingRepository.findById(request.getTaxFilingId()).orElse(null);

        Payment payment = new Payment();

        payment.setPaymentDate(request.getPaymentDate());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus(request.getPaymentStatus());
        payment.setTransactionId(request.getTransactionId());

        payment.setTaxFiling(taxFiling);

        if (taxFiling != null) {
            taxFiling.setStatus("PENDING");
            taxFilingRepository.save(taxFiling);
        }

        return paymentRepository.save(payment);
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    @Override
    public Payment updatePayment(Long id, PaymentRequest request) {

        Payment existingPayment = paymentRepository.findById(id).orElse(null);

        if (existingPayment == null) {
            return null;
        }

        TaxFiling taxFiling = taxFilingRepository.findById(request.getTaxFilingId()).orElse(null);

        existingPayment.setPaymentDate(request.getPaymentDate());
        existingPayment.setAmount(request.getAmount());
        existingPayment.setPaymentMethod(request.getPaymentMethod());
        existingPayment.setPaymentStatus(request.getPaymentStatus());
        existingPayment.setTransactionId(request.getTransactionId());
        existingPayment.setTaxFiling(taxFiling);

        return paymentRepository.save(existingPayment);
    }

    @Override
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}
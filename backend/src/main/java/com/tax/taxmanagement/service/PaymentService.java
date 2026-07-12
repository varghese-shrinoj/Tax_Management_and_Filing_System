package com.tax.taxmanagement.service;

import java.util.List;

import com.tax.taxmanagement.dto.PaymentRequest;
import com.tax.taxmanagement.entity.Payment;

public interface PaymentService {

    Payment createPayment(PaymentRequest request);

    List<Payment> getAllPayments();

    Payment getPaymentById(Long id);

    Payment updatePayment(Long id, PaymentRequest request);

    void deletePayment(Long id);

}
package com.tax.taxmanagement.dto;

import java.time.LocalDate;

public class PaymentRequest {

    private LocalDate paymentDate;
    private Double amount;
    private String paymentMethod;
    private String paymentStatus;
    private String transactionId;
    private Long taxFilingId;

    public PaymentRequest() {
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Long getTaxFilingId() {
        return taxFilingId;
    }

    public void setTaxFilingId(Long taxFilingId) {
        this.taxFilingId = taxFilingId;
    }
}
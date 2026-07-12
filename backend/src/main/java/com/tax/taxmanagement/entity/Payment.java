package com.tax.taxmanagement.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate paymentDate;

    private Double amount;

    private String paymentMethod;

    private String paymentStatus;

    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "tax_filing_id")
    private TaxFiling taxFiling;

    public Payment() {
    }

    public Payment(Long id, LocalDate paymentDate, Double amount,
            String paymentMethod, String paymentStatus,
            String transactionId, TaxFiling taxFiling) {
        this.id = id;
        this.paymentDate = paymentDate;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.transactionId = transactionId;
        this.taxFiling = taxFiling;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public TaxFiling getTaxFiling() {
        return taxFiling;
    }

    public void setTaxFiling(TaxFiling taxFiling) {
        this.taxFiling = taxFiling;
    }
}
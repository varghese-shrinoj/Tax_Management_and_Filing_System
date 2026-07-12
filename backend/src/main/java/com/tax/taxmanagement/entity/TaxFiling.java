package com.tax.taxmanagement.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "tax_filings")
public class TaxFiling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String financialYear;

    @Column(nullable = false)
    private Double annualIncome;

    @Column(nullable = false)
    private Double taxAmount;

    @Column(nullable = false)
    private LocalDate filingDate;

    @Column(nullable = false)
    private String status;

    private String filingType;

    private String organizationName;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "tax_type_id")
    private TaxType taxType;

    public TaxFiling() {
    }

    public TaxFiling(Long id, String financialYear, Double annualIncome,
            Double taxAmount, LocalDate filingDate,
            String status, String filingType, String organizationName,
            String feedback, User user, TaxType taxType) {

        this.id = id;
        this.financialYear = financialYear;
        this.annualIncome = annualIncome;
        this.taxAmount = taxAmount;
        this.filingDate = filingDate;
        this.status = status;
        this.filingType = filingType;
        this.organizationName = organizationName;
        this.feedback = feedback;
        this.user = user;
        this.taxType = taxType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFinancialYear() {
        return financialYear;
    }

    public void setFinancialYear(String financialYear) {
        this.financialYear = financialYear;
    }

    public Double getAnnualIncome() {
        return annualIncome;
    }

    public void setAnnualIncome(Double annualIncome) {
        this.annualIncome = annualIncome;
    }

    public Double getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(Double taxAmount) {
        this.taxAmount = taxAmount;
    }

    public LocalDate getFilingDate() {
        return filingDate;
    }

    public void setFilingDate(LocalDate filingDate) {
        this.filingDate = filingDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFilingType() {
        return filingType;
    }

    public void setFilingType(String filingType) {
        this.filingType = filingType;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TaxType getTaxType() {
        return taxType;
    }

    public void setTaxType(TaxType taxType) {
        this.taxType = taxType;
    }
}
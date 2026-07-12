package com.tax.taxmanagement.dto;

public class ReportResponse {

    private Long totalUsers;
    private Long totalTaxFilings;
    private Long totalPayments;
    private Long totalDocuments;
    private Double totalRevenue;

    public ReportResponse() {
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalTaxFilings() {
        return totalTaxFilings;
    }

    public void setTotalTaxFilings(Long totalTaxFilings) {
        this.totalTaxFilings = totalTaxFilings;
    }

    public Long getTotalPayments() {
        return totalPayments;
    }

    public void setTotalPayments(Long totalPayments) {
        this.totalPayments = totalPayments;
    }

    public Long getTotalDocuments() {
        return totalDocuments;
    }

    public void setTotalDocuments(Long totalDocuments) {
        this.totalDocuments = totalDocuments;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
package com.tax.taxmanagement.dto;

public class DashboardResponse {

    private Long totalUsers;
    private Long totalTaxFilings;
    private Long totalPayments;
    private Long totalDocuments;

    private Long totalIndividualFilings;
    private Long totalOrganizationFilings;
    private Long totalIndividualPayments;
    private Long totalOrganizationPayments;

    public DashboardResponse() {
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

    public Long getTotalIndividualFilings() {
        return totalIndividualFilings;
    }

    public void setTotalIndividualFilings(Long totalIndividualFilings) {
        this.totalIndividualFilings = totalIndividualFilings;
    }

    public Long getTotalOrganizationFilings() {
        return totalOrganizationFilings;
    }

    public void setTotalOrganizationFilings(Long totalOrganizationFilings) {
        this.totalOrganizationFilings = totalOrganizationFilings;
    }

    public Long getTotalIndividualPayments() {
        return totalIndividualPayments;
    }

    public void setTotalIndividualPayments(Long totalIndividualPayments) {
        this.totalIndividualPayments = totalIndividualPayments;
    }

    public Long getTotalOrganizationPayments() {
        return totalOrganizationPayments;
    }

    public void setTotalOrganizationPayments(Long totalOrganizationPayments) {
        this.totalOrganizationPayments = totalOrganizationPayments;
    }
}
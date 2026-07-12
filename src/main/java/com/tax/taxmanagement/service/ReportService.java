package com.tax.taxmanagement.service;

import java.util.List;

import com.tax.taxmanagement.dto.ReportResponse;
import com.tax.taxmanagement.entity.Document;
import com.tax.taxmanagement.entity.Payment;
import com.tax.taxmanagement.entity.TaxFiling;
import com.tax.taxmanagement.entity.User;

public interface ReportService {

    ReportResponse getSummaryReport();

    List<User> getUsersReport();

    List<TaxFiling> getTaxFilingsReport();

    List<Payment> getPaymentsReport();

    List<Document> getDocumentsReport();

    Double getRevenueReport();

}
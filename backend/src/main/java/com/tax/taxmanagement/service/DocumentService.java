package com.tax.taxmanagement.service;

import java.util.List;

import com.tax.taxmanagement.dto.DocumentRequest;
import com.tax.taxmanagement.entity.Document;

public interface DocumentService {

    Document uploadDocument(DocumentRequest request);

    List<Document> getAllDocuments();

    Document getDocumentById(Long id);

    Document updateDocument(Long id, DocumentRequest request);

    void deleteDocument(Long id);

}
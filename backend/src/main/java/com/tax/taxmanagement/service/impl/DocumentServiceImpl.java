package com.tax.taxmanagement.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tax.taxmanagement.dto.DocumentRequest;
import com.tax.taxmanagement.entity.Document;
import com.tax.taxmanagement.entity.TaxFiling;
import com.tax.taxmanagement.repository.DocumentRepository;
import com.tax.taxmanagement.repository.TaxFilingRepository;
import com.tax.taxmanagement.service.DocumentService;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private TaxFilingRepository taxFilingRepository;

    @Override
    public Document uploadDocument(DocumentRequest request) {

        TaxFiling taxFiling = taxFilingRepository.findById(request.getTaxFilingId()).orElse(null);

        Document document = new Document();

        document.setFileName(request.getFileName());
        document.setFileType(request.getFileType());
        document.setFilePath(request.getFilePath());
        document.setUploadDate(request.getUploadDate());
        document.setDocumentCategory(request.getDocumentCategory());
        document.setTaxFiling(taxFiling);

        return documentRepository.save(document);
    }

    @Override
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    @Override
    public Document getDocumentById(Long id) {
        return documentRepository.findById(id).orElse(null);
    }

    @Override
    public Document updateDocument(Long id, DocumentRequest request) {

        Document existingDocument = documentRepository.findById(id).orElse(null);

        if (existingDocument == null) {
            return null;
        }

        TaxFiling taxFiling = taxFilingRepository.findById(request.getTaxFilingId()).orElse(null);

        existingDocument.setFileName(request.getFileName());
        existingDocument.setFileType(request.getFileType());
        existingDocument.setFilePath(request.getFilePath());
        existingDocument.setUploadDate(request.getUploadDate());
        existingDocument.setDocumentCategory(request.getDocumentCategory());
        existingDocument.setTaxFiling(taxFiling);

        return documentRepository.save(existingDocument);
    }

    @Override
    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }
}
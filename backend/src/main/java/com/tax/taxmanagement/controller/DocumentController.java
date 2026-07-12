package com.tax.taxmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.tax.taxmanagement.dto.DocumentRequest;
import com.tax.taxmanagement.entity.Document;
import com.tax.taxmanagement.service.DocumentService;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin("*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping
    public Document uploadDocument(@RequestBody DocumentRequest request) {
        return documentService.uploadDocument(request);
    }

    @GetMapping
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    @GetMapping("/{id}")
    public Document getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentById(id);
    }

    @PutMapping("/{id}")
    public Document updateDocument(@PathVariable Long id,
                                   @RequestBody DocumentRequest request) {
        return documentService.updateDocument(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return "Document Deleted Successfully";
    }
}
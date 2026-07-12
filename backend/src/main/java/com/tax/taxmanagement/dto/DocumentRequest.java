package com.tax.taxmanagement.dto;

import java.time.LocalDate;

public class DocumentRequest {

    private String fileName;
    private String fileType;
    private String filePath;
    private LocalDate uploadDate;
    private String documentCategory;
    private Long taxFilingId;

    public DocumentRequest() {
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDate getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDate uploadDate) {
        this.uploadDate = uploadDate;
    }

    public String getDocumentCategory() {
        return documentCategory;
    }

    public void setDocumentCategory(String documentCategory) {
        this.documentCategory = documentCategory;
    }

    public Long getTaxFilingId() {
        return taxFilingId;
    }

    public void setTaxFilingId(Long taxFilingId) {
        this.taxFilingId = taxFilingId;
    }
}
package com.tax.taxmanagement.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String fileType;

    private String filePath;

    private LocalDate uploadDate;

    private String documentCategory;

    @ManyToOne
    @JoinColumn(name = "tax_filing_id")
    private TaxFiling taxFiling;

    public Document() {
    }

    public Document(Long id, String fileName, String fileType,
                    String filePath, LocalDate uploadDate,
                    String documentCategory, TaxFiling taxFiling) {
        this.id = id;
        this.fileName = fileName;
        this.fileType = fileType;
        this.filePath = filePath;
        this.uploadDate = uploadDate;
        this.documentCategory = documentCategory;
        this.taxFiling = taxFiling;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public TaxFiling getTaxFiling() {
        return taxFiling;
    }

    public void setTaxFiling(TaxFiling taxFiling) {
        this.taxFiling = taxFiling;
    }
}
package com.tax.taxmanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name="tax_types")
public class TaxType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String taxName;

    private String description;

    public TaxType() {
    }

    public TaxType(Long id, String taxName, String description) {
        this.id = id;
        this.taxName = taxName;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTaxName() {
        return taxName;
    }

    public void setTaxName(String taxName) {
        this.taxName = taxName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
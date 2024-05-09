package com.SFAE.SFAE.DTO;

import lombok.Data;

@Data
public class ContractDTO {

    private Long id;  // Optional, für Updates nötig
    private String jobType;
    private String adress;
    private String payment;
    private String description;
    private String statusOrder;
    private Double range;
    private Long customerId;  // Referenziert den ID des Kunden
    private Long workerId;    // Referenziert den ID des Arbeiters

    public ContractDTO(){

    };

    public ContractDTO(String jobType, String adress, String payment, String description, String statusOrder,
            Double range, Long customerId, Long workerId) {
        this.jobType = jobType;
        this.adress = adress;
        this.payment = payment;
        this.description = description;
        this.statusOrder = statusOrder;
        this.range = range;
        this.customerId = customerId;
        this.workerId = workerId;
    }

    public ContractDTO(Long id, String jobType, String adress, String payment, String description, String statusOrder,
            Double range, Long customerId, Long workerId) {
        this.id = id;
        this.jobType = jobType;
        this.adress = adress;
        this.payment = payment;
        this.description = description;
        this.statusOrder = statusOrder;
        this.range = range;
        this.customerId = customerId;
        this.workerId = workerId;
    }
}

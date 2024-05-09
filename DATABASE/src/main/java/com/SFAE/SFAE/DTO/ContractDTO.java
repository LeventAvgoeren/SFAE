package com.SFAE.SFAE.DTO;

import lombok.Data;
import javax.validation.constraints.NotBlank;

@Data
public class ContractDTO {

    private Long id;  
    @NotBlank(message = "Job type is required")
    private String jobType;
    @NotBlank(message = "adress is required")
    private String adress;
    @NotBlank(message = "payment is required")
    private String payment;
    @NotBlank(message = "description is required")
    private String description;
    @NotBlank(message = "statusOrder is required")
    private String statusOrder;
    @NotBlank(message = "range is required")
    private Double range;
    @NotBlank(message = "CustomerId is required")
    private Long customerId;  // Referenziert den ID des Kunden
    @NotBlank(message = "WorkerId is required")
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

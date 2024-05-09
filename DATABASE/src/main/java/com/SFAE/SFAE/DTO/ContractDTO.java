package com.SFAE.SFAE.DTO;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;


@Data
public class ContractDTO {

    private Long id;  
    @NotEmpty
    @NotBlank(message = "Job type is required")
    private String jobType;
    @NotEmpty
    @NotBlank(message = "adress is required")
    private String adress;
    @NotEmpty
    @NotBlank(message = "payment is required")
    private String payment;
    @NotEmpty
    @NotBlank(message = "description is required")
    private String description;
    @NotEmpty
    @NotBlank(message = "statusOrder is required")
    private String statusOrder;
    @NotEmpty
    @NotNull(message = "range is required")
    private Double range;
    @NotEmpty
    @NotNull(message = "CustomerId is required")
    private Long customerId;  // Referenziert den ID des Kunden
    @NotEmpty
    @NotNull(message = "WorkerId is required")
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

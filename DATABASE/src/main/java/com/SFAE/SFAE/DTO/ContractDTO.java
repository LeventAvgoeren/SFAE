package com.SFAE.SFAE.DTO;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;


/**
 * @author erayzor
 */

@Data
public class ContractDTO {

    private Long id; 

    @NotNull
    @NotEmpty
    @NotBlank(message = "Job type is required")
    private String jobType;

    @NotNull
    @NotEmpty
    @NotBlank(message = "adress is required")
    private String adress;

    @NotNull
    @NotEmpty
    @NotBlank(message = "payment is required")
    private String payment;

    @NotNull
    @NotEmpty
    @NotBlank(message = "payment is required")
    private Double maxPayment;

    @NotNull
    @NotEmpty
    @NotBlank(message = "description is required")
    private String description;

    @NotNull
    @NotEmpty
    @NotBlank(message = "statusOrder is required")
    private String statusOrder;

    @NotNull
    @NotEmpty
    @NotNull(message = "range is required")
    private Double range;

    @NotNull
    @NotEmpty
    @NotNull(message = "CustomerId is required")
    private String customerId;  // Referenziert den ID des Kunden

    @NotNull
    @NotEmpty
    @NotNull(message = "WorkerId is required")
    private String workerId;    // Referenziert den ID des Arbeiters

    private Double latitude;
    private Double longitude;

    public ContractDTO(){

    };

    public ContractDTO(String jobType, String adress, String payment, String description, String statusOrder,
            Double range, String customerId, String workerId) {
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
            Double range, String customerId, String workerId) {
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

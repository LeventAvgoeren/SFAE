package com.SFAE.SFAE.INTERFACE;

import java.util.List;

import com.SFAE.SFAE.DTO.ContractDTO;
import com.SFAE.SFAE.ENTITY.Contract;

/**
 * The ContractInterface provides a set of methods to manage contract entities within the system.
 * It defines operations to retrieve, update, delete, and create contracts, allowing for contract
 * management functionality to be implemented by any class that adopts this interface.
 * @author Levent Avgören
 * @author Eray Zor
 */
public interface ContractInterface {

    /**
     * Retrieves a contract based on the given contract ID.
     *
     * @param id the unique identifier of the contract to retrieve
     * @return the contract associated with the specified ID, or null if no such contract exists.
     */
    Contract getContract(long id);

    /**
     * Updates the provided contract instance in the system.
     * <p>
     * This method should ensure that all necessary validations are performed on the contract
     * before updating it in the data store. If the contract does not exist or data is invalid,
     * appropriate exceptions should be thrown.
     *
     * @param contract the contract to be updated
     * @return the updated version of the contract
     * @throws IllegalArgumentException if the contract data is invalid
     * @throws IllegalStateException if the contract does not exist
     */
    Contract updateContract(ContractDTO contract);

    /**
     * Deletes a contract from the system based on the contract ID.
     *
     * @param id the unique identifier of the contract to be deleted
     * @return true if the contract was successfully deleted, false if the contract does not exist
     */
    boolean deleteContract(long id);

    /**
     * Creates a new contract in the system using the provided contract data.
     * <p>
     * This method should handle all necessary validation of the contract data and ensure that
     * the new contract does not violate any system constraints or rules.
     *
     * @param contract the contract to be created
     * @return the newly created contract
     * @throws IllegalArgumentException if the provided contract data is invalid
     */
    Contract createContract(ContractDTO contract);

    /**
 * Counts the total number of contracts currently stored in the system.
 *
 * This method provides an essential overview for administrative purposes, giving a count
 * that can be used for reporting and monitoring.
 *
 * @return The total number of contracts.
 */
    long countContracts();


    /**
 * Retrieves all contracts associated with a specific customer identified by their unique identifier.
 *
 * This method is useful for customer service and management purposes, allowing the retrieval
 * of all contracts where a particular customer is involved.
 *
 * @param id The unique identifier of the customer.
 * @return A list of all contracts related to the specified customer or an empty list if no contracts are found.
 */
    List<Contract>getContractByCustomerId(String id);

/**
 * Retrieves all contracts associated with a specific worker identified by their unique identifier.
 *
 * This method is useful for managing and reviewing all the contracts a worker is assigned to,
 * facilitating operations and HR management.
 *
 * @param id The unique identifier of the worker.
 * @return A list of all contracts related to the specified worker or an empty list if no contracts are found.
 */
    List<Contract>getContractByWorkerId(String id);


    /**
 * Updates the worker ID for a specific contract.
 *
 * This method allows the association of a different worker to a contract, which can be necessary
 * in situations where reassignment is required due to scheduling conflicts, expertise requirements,
 * or other operational considerations.
 *
 * @param contractId The ID of the contract to update.
 * @param workerId The new worker ID to assign to the contract.
 * @return true if the worker ID was successfully updated, false otherwise.
 * @throws IllegalArgumentException if the contractId or workerId is invalid.
 */
    Boolean updateWorkerId(long contractid,String workerId);

    Boolean updateOrderStatus(Long contractId,String statusOrder);
    
}

package com.SFAE.SFAE.INTERFACE;

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
}

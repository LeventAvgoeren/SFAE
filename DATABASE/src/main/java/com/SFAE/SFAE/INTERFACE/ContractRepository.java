package com.SFAE.SFAE.INTERFACE;

import com.SFAE.SFAE.ENTITY.Contract;


import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the {@link Contract} entities.
 *
 * This interface extends JpaRepository, providing CRUD operations and the ability to leverage
 * Spring Data's repository abstraction for {@link Contract} entities. It allows the application
 * to interact with the database to perform standard operations like create, read, update, and delete
 * contracts without needing to write detailed SQL or other database-specific queries.
 *
 * By extending JpaRepository, this repository inherits several methods for working with Contract persistence,
 * including methods for saving, deleting, and finding Contracts by various criteria.
 *
 * Usage of this repository also enables features like pagination and sorting, making it a robust
 * tool for any data access layer in applications managing contracts.
 */
public interface ContractRepository extends JpaRepository<Contract, String> {
    
}

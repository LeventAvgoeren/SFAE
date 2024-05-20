package com.SFAE.SFAE.INTERFACE;

import com.SFAE.SFAE.ENTITY.Contract;


import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractRepository extends JpaRepository<Contract, String> {
    
}

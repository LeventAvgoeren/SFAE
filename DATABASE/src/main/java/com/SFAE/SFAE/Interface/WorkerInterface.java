package com.SFAE.SFAE.INTERFACE;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.SFAE.SFAE.ENTITY.Worker;

@RepositoryRestResource
public interface WorkerInterface extends JpaRepository<Worker, Long> {
    
}

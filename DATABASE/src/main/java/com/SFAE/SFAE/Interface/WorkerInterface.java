package com.SFAE.SFAE.Interface;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.SFAE.SFAE.Entity.Worker;

@RepositoryRestResource
public interface WorkerInterface extends JpaRepository<Worker, Long> {
    
}

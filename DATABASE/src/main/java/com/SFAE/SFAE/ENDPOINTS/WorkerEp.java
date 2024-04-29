package com.SFAE.SFAE.ENDPOINTS;

import java.util.Map;




import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;


import com.SFAE.SFAE.DTO.WorkerDTO;

import com.SFAE.SFAE.ENTITY.Worker;

/**
 * @author Levent
 */

 @RequestMapping("/worker")
public interface WorkerEp {
  
    @PostMapping("")
    ResponseEntity<Worker> createWorker(@RequestBody WorkerDTO worker);

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteWorkerById(@PathVariable("id") long id);

    @GetMapping("")
    Iterable<Worker> findAllWorker();

    @GetMapping("/{id}")
    ResponseEntity<?> findWorkersbyID(@PathVariable("id") long id);

    @GetMapping("/usr/{name}")
    ResponseEntity<?>findWorkerByName(@PathVariable String name);

    @PutMapping("")
    ResponseEntity<?> updateWorker(@RequestBody Map<String, Object> jsonData);
    
}


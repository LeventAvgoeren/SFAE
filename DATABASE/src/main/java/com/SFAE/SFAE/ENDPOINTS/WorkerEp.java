package com.SFAE.SFAE.ENDPOINTS;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.SFAE.SFAE.ENTITY.Worker;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

/**
 * @author Levent
 */
<<<<<<< HEAD
//Interface für den Controller
public interface WorkerEp{
  
    @PostMapping("")
    ResponseEntity<Worker> createWorker(@RequestBody Map<String, Object> jsonData);

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteWorkerById(long id);

    @GetMapping("")
    Iterable<Worker> findAllWorker();

    @GetMapping("/{id}")
    Worker findWorkersbyID(long id);

    @GetMapping("/{name}")
    Worker findWorkerByName(String Name);

    @PutMapping("")
=======

 @RequestMapping("/worker")
public interface WorkerEp {
  
    @PostMapping("")
   
    ResponseEntity<Worker> createWorker(@RequestBody Worker worker);

    @DeleteMapping("/{id}")

    ResponseEntity<?> deleteWorkerById(@PathVariable long id);

    @GetMapping("")
   
    Iterable<Worker> findAllWorker();

    @GetMapping("/{id}")
   
    Worker findWorkersbyID(@PathVariable long id);

    @GetMapping("/{name}")
  
    Worker findWorkerByName(@PathVariable String name);

    @PutMapping("")
   
>>>>>>> bc25efc2c283af5a779c68d3ee7c9341a731c947
    ResponseEntity<?> updateWorker(@RequestBody Map<String, Object> jsonData);
    
}

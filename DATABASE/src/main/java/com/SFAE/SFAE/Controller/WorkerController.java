package com.SFAE.SFAE.Controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.SFAE.SFAE.DTO.WorkerDTO;
import com.SFAE.SFAE.ENDPOINTS.WorkerEp;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;

import io.swagger.v3.oas.annotations.parameters.RequestBody;



/**
 * @author Levent
 */

//Klasse dient als Communication zwischen frontend und backend 
@RestController
public class WorkerController implements WorkerEp {

    @Autowired
    private WorkerInterface dao;

    @Override
    public ResponseEntity<Worker> createWorker(@RequestBody WorkerDTO worker) {
        try{
            Worker builded=dao.createWorker(worker);
            
                return ResponseEntity.status(HttpStatus.CREATED).body(builded);
        }
        catch(Exception e){
            throw new IllegalArgumentException(e);
        }
        
    }

    @Override
    public ResponseEntity<?> deleteWorkerById(long id) {
        try{
            boolean result=dao.deleteWorkerById(id);
            if(result){
                return ResponseEntity.status(HttpStatus.OK).build();
            }
        }
        catch(Error error){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    }

    @Override
    public ResponseEntity<Iterable<Worker>> findAllWorker() {
        //Gucken ob es geht 
       var worker= dao.findAllWorker();
       return ResponseEntity.status(HttpStatus.FOUND).body(worker);
    }

    @Override
    public ResponseEntity<?> findWorkersbyID(long id) {
        if(id<0){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
            Worker found=dao.findWorkersbyID(id);


        return ResponseEntity.status(HttpStatus.OK).body(found);
    }

    @Override
    public ResponseEntity<?> findWorkerByName(String name) {
        if(name.length()<0){
            throw new IllegalArgumentException("Name not found for "+name);
        }
          Worker found=dao.findWorkerbyName(name);
          return ResponseEntity.status(HttpStatus.OK).body(found);
        }

    @Override
    public ResponseEntity<?> updateWorker(Map<String, Object> jsonData) {
        throw new UnsupportedOperationException("Unimplemented method 'findWorkerByName'");
    }


}

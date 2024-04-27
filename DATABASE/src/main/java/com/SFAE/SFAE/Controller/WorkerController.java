package com.SFAE.SFAE.Controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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
    public ResponseEntity<Worker> createWorker( @RequestBody Map<String, Object> jsonData) {
        try{
            Optional<Worker> builded=dao.createWorker(jsonData);
            if(builded.isPresent()){
                return ResponseEntity.status(HttpStatus.CREATED).body(builded.get());
            }
        

        
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Override
    public ResponseEntity<?> deleteWorkerById(long id) {
        try{
            dao.deleteWorkerById(id);
        }
        catch(Error error){
            throw new IllegalArgumentException(error+"This"+id+"Coudnt be deleted");
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Override
    public Iterable<Worker> findAllWorker() {
       return dao.findAllWorker();
    }

    @Override
    public Worker findWorkersbyID(long id) {
        if(id<0){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
            Worker found=dao.findWorkersbyID(id)
        .map(c-> c)
        .orElseThrow(() ->  new ResponseStatusException(HttpStatus.NOT_FOUND));

        return found;
    }

    @Override
    public Worker findWorkerByName(String name) {
        if(name.length()<0){
            throw new IllegalArgumentException("Name not found for "+name);
        }
        Worker found=dao.findWorkerbyName(name)
        .map(c->c)
        .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return found;
        }

    @Override
    public ResponseEntity<?> updateWorker(Map<String, Object> jsonData) {
        throw new UnsupportedOperationException("Unimplemented method 'findWorkerByName'");
    }


}

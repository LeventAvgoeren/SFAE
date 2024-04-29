package com.SFAE.SFAE.Controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.SFAE.SFAE.DTO.WorkerDTO;
import com.SFAE.SFAE.ENDPOINTS.WorkerEp;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.Service.Authentication;

import io.swagger.v3.oas.annotations.parameters.RequestBody;



/**
 * @author Levent
 */

//Klasse dient als Communication zwischen frontend und backend 
@RestController
public class WorkerController implements WorkerEp {

    @Autowired
    private WorkerInterface dao;

    @Autowired
    private Authentication login;

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
       try{
                    var worker =dao.findAllWorker();
            return ResponseEntity.status(HttpStatus.OK).body(worker);
       }
       catch(Exception e){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
       }
      
     
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
    public ResponseEntity<Worker> updateWorker(@RequestBody WorkerDTO jsonData) {
        try{
            dao.updateWorker(jsonData);
            
        }
        catch(Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        }
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    @Override
    public ResponseEntity<?> loginWorker(String email, String password) {
        try{
            login.loginWorker(email, password);
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        }
       catch(Exception e) {
        return ResponseEntity.status(HttpStatus.NON_AUTHORITATIVE_INFORMATION).build();
       }
    }


}

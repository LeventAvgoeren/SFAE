package com.SFAE.SFAE.Controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.SFAE.SFAE.ENDPOINTS.WorkerEp;
import com.SFAE.SFAE.ENTITY.Worker;



/**
 * @author Levent
 */


@RestController
public class WorkerController implements WorkerEp {

    @Override
    public ResponseEntity<Worker> createWorker(Map<String, Object> jsonData) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createWorker'");
    }

    @Override
    public ResponseEntity<?> deleteWorkerById(long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteWorkerById'");
    }

    @Override
    public Iterable<Worker> findAllWorker() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAllWorker'");
    }

    @Override
    public Optional<Worker> findWorkersbyID(long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findWorkersbyID'");
    }

    @Override
    public Worker findWorkerByName(String Name) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findWorkerByName'");
    }

    @Override
    public ResponseEntity<?> updateWorker(Map<String, Object> jsonData) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateWorker'");
    }


}

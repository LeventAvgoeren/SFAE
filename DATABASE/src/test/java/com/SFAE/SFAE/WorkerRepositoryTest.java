package com.SFAE.SFAE;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;
import java.sql.Connection;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.INTERFACE.WorkerRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class WorkerRepositoryTest {

    @Autowired
    private WorkerRepository workerRepository;

    @Test
    public void testFindAllOrderedById() {
        assertNotNull(workerRepository);

        List<Worker> workers = workerRepository.findAllOrderedById();
        assertNotNull(workers, "The workers list should not be null");
        assertFalse(workers.isEmpty(), "The workers list should not be empty");

       
        workers.forEach(worker -> System.out.println(worker.getId()));
    }

    @Test 
    public void testConnection(){
        String url1 = "jdbc:postgresql://database-1.c50e84skqirn.eu-central-1.rds.amazonaws.com:5432/postgres?sslmode=require";
        String url2 = "jdbc:postgresql://database-1.c50e84skqirn.eu-central-1.rds.amazonaws.com:5432/postgres";
        String user = "postgres";
        String password = "2806Eray";

        try (Connection conn1 = DriverManager.getConnection(url1, user, password)) {
            System.out.println("Connection to URL1 successful!");
        } catch (SQLException e) {
            System.out.println("Failed to connect to URL1: " + e.getMessage());
        }

        try (Connection conn2 = DriverManager.getConnection(url2, user, password)) {
            System.out.println("Connection to URL2 successful!");
        } catch (SQLException e) {
            System.out.println("Failed to connect to URL2: " + e.getMessage());
        }
    }
}

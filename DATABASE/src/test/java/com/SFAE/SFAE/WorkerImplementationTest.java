package com.SFAE.SFAE;

import static org.junit.Assert.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.SFAE.SFAE.INTERFACE.CustomerInterface;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;

import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
public class WorkerImplementationTest {
  
  @Autowired
  WorkerInterface dao;

    @Test
  public void deleteWorker() {
    Boolean result = dao.deleteWorkerById("W2");
    assertTrue(result);
  }

  @Test
  public void deleteWorkerError() {
    assertFalse(dao.deleteWorkerById("W20000"));
  }

  @Test
  public void deleteWorkerByidWithOpenContracts() {
      assertThrows(IllegalArgumentException.class, () -> {
          dao.deleteWorkerById("W1");
      }, "You can not delete your account if you have open contracts");
  }

  @Test
  public void deleteWorkerByidWithNotOpen() {
   assertTrue(dao.deleteWorkerById("W13"));
  }
}

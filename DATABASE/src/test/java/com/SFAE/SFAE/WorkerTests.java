package com.SFAE.SFAE;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

/**
 * @author Levent
 */


@SpringBootTest
@AutoConfigureMockMvc
public class WorkerTests{

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PlatformTransactionManager transactionManager;

    @Test
    public void testCreateWorker() throws Exception {
        String json = "{\"name\": \"Max Mustermann\", \"location\": \"Berlin\", \"password\": \"passwort123\", \"status\": \"AVAILABLE\", \"statusOrder\": \"ACCEPTED\", \"range\": 1.1, \"jobType\": \"CHEF\", \"minPayment\": 1.1, \"rating\": 1.1, \"verification\": true, \"email\": \"Leventavgoren@gmail.com\"}";
        System.out.println(json);
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        mockMvc.perform(post("/worker")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated());

        transactionManager.commit(status);  
    }
}

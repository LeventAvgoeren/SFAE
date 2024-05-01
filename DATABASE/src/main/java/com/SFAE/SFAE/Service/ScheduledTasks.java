package com.SFAE.SFAE.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {

   @Autowired
    private MailService emailService;

    //@Scheduled(fixedRate = 60000)  // Sendet eine E-Mail alle 60 Sekunden
    //public void sendEmailAutomatically() {
     //   emailService.sendSimpleMessage("dds", "Automatische E-Mail", "Hallo, dies ist eine automatisch gesendete Nachricht!");
  //  }
  
}

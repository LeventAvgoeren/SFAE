package com.SFAE.SFAE.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


@Service
public class MailService {


 @Autowired
    private JavaMailSender mailSender;
    @Scheduled(fixedRate = 60000)
    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom("Leventavgoren@gmail.com");
        message.setTo(to); 
        message.setSubject(subject); 
        message.setText(text);
        mailSender.send(message);
        System.out.println("E-Mail erfolgreich an " + to + " gesendet.");
    }

    
}

package com.SFAE.SFAE.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service for Sending Emails.
 * 
 * This service class provides methods for sending simple email messages using
 * Spring Mail.
 * 
 * @author Levent
 * @author erayzor
 */

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Sends a simple email message.
     * 
     * @param to      the recipient's email address
     * @param subject the subject of the email
     * @param text    the content of the email
     */
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

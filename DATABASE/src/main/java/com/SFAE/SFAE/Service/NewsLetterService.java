package com.SFAE.SFAE.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.SFAE.SFAE.ENTITY.NewsLetter;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.INTERFACE.NewsLetterRepository;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;

import jakarta.mail.MessagingException;

@Service
public class NewsLetterService {

    @Autowired
    private NewsLetterRepository newsLetterRepository;

    @Autowired
    private WorkerInterface worker;

    @Autowired
    private MailService mail;

    public Boolean sendNewsLetter(String jobTyp) {

        Worker workers = worker.findWorkerByJob(jobTyp);
        List<NewsLetter> found = newsLetterRepository.findAll();

        // Wenn es den job noch nicht gibt sende eine email an alle customer das es
        // einen neuen arbeiter gibt
        if (workers == null) {
            for (NewsLetter data : found) {
                try {
                    String emailSubject = "Wir haben tolle Nachrichten!";
                    String emailContent = "<h1>Neuer Arbeiter eingestellt!</h1>"
                            + "<p>Liebe Kunden,</p>"
                            + "<p>Wir freuen uns, Ihnen mitteilen zu können, dass wir einen neuen Arbeiter in unserem Team haben, der auf den Jobtyp <strong>"
                            + jobTyp + "</strong> spezialisiert ist.</p>"
                            + "<p>Wir sind sicher, dass dieser neue Mitarbeiter unsere Dienstleistungen weiter verbessern wird.</p>"
                            + "<p>Vielen Dank für Ihr Vertrauen und Ihre Unterstützung.</p>"
                            + "<p>Mit freundlichen Grüßen,</p>"
                            + "<p>Ihr SFAE Team</p>";

                    mail.sendHtmlMessage(data.getCustomerEmail(), emailSubject, emailContent);
                    NewsLetter news = new NewsLetter(data.getCustomerEmail(), emailContent);
                    newsLetterRepository.save(news);
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
            }
            return true;
        } else {
            return false;
        }
    }

    public void sendOwnNewsLetter(String titel, String text) {
        if (text == null || text.isEmpty()) {
            throw new IllegalArgumentException("Text is empty: " + text);
        }
        try {
            List<NewsLetter> user = newsLetterRepository.findAll();
            for (NewsLetter data : user) {
                mail.sendHtmlMessage(data.getCustomerEmail(), titel, text);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

package com.SFAE.SFAE.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.SFAE.SFAE.ENTITY.NewsLetter;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.INTERFACE.NewsLetterRepository;
import com.SFAE.SFAE.INTERFACE.WorkerInterface;
import com.SFAE.SFAE.INTERFACE.WorkerRepository;

import jakarta.mail.MessagingException;

@Service
public class NewsLetterService {

    @Autowired
    private NewsLetterRepository newsLetterRepository;

    @Autowired
    private WorkerInterface worker;

    @Autowired
    private WorkerRepository workerRep;

    @Autowired
    private MailService mail;

    public Boolean sendNewsLetter(List<JobList> jobTyp) {
        try {
            
       
        // Hole mir alle news
        List<NewsLetter> found = newsLetterRepository.findAll();
        //Hole mir alleWorker 
        List<String> workerIdList= workerRep.findAllOrderedById();
        
     
        //workerFound.removeLast();
        for (JobList jobList : jobTyp) {
            Worker workers = worker.findWorkerByJob(jobList.name());

            // Wenn es den job noch nicht gibt sende eine email an alle customer das es
            // einen neuen arbeiter gibt
            if (workers == null || workerIdList.get(workerIdList.size() - 1).equals(workers.getId())) {
                for (NewsLetter data : found) {
                    try {
                        String emailSubject = "Wir haben tolle Nachrichten!";
                        String emailContent = "<h1>Ein neuer Job ist nun bei SFAE verfügbar!</h1>"
                                + "<p>Liebe Kunden,</p>"
                                + "<p>Wir freuen uns, Ihnen mitteilen zu können, dass wir einen neuen Arbeiter in unserem Team haben, der auf den Jobtyp <strong>"
                                + jobTyp.toString().replace("[", "").replace("]", "") + "</strong> spezialisiert ist.</p>";
                             
                        if(data.getCustomerEmail().isEmpty() ||data.getCustomerEmail().isBlank() || data.getCustomerEmail().equals("") || data.getCustomerEmail() == null || data.getCustomerEmail().equals("\"\"")){
                            continue;
                        }

                        String cleanEmail = data.getCustomerEmail().replace("\"", "");
                        mail.sendHtmlMessage(cleanEmail, emailSubject, emailContent);

                    } catch (MessagingException e) {
                        e.printStackTrace();
                    }
                }
                return true;
            }
        }
        } catch (Exception e) {
            System.out.println("FEHLER: " + e);
        }

        return false;
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

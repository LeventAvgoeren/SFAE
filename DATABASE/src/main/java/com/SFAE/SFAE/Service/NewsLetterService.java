package com.SFAE.SFAE.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.SFAE.SFAE.ENTITY.NewsLetter;
import com.SFAE.SFAE.ENTITY.Worker;
import com.SFAE.SFAE.ENUM.JobList;
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


    public Worker findWorkerWithHighestId(List<Worker> workers) {
        if (workers.isEmpty()) {
            return null;
        }

        Worker highestIdWorker = workers.get(0);
        int highestId = extractNumericId(highestIdWorker.getId());

        for (Worker worker : workers) {
            int workerId = extractNumericId(worker.getId());
            if (workerId > highestId) {
                highestIdWorker = worker;
                highestId = workerId;
            }
        }

        return highestIdWorker;
    }

    private int extractNumericId(String id) {
        return Integer.parseInt(id.replaceAll("\\D+", ""));
    }

    public Boolean sendNewsLetter(List<JobList> jobTyp) {
        // Hole mir alle news
        List<NewsLetter> found = newsLetterRepository.findAll();
        //Hole mir alleWorker 
        Iterable<Worker> allWorker=worker.findAllWorker();
        //packe alle Worker in eine liste
        List<Worker> workerFound= new ArrayList<>();
        for (Worker worker : allWorker) {
            workerFound.add(worker);
        }
        //workerFound.removeLast();
        for (JobList jobList : jobTyp) {
            Worker workers = worker.findWorkerByJob(jobList.name());

            // Wenn es den job noch nicht gibt sende eine email an alle customer das es
            // einen neuen arbeiter gibt

            Worker lastRegisteredWorker = findWorkerWithHighestId(workerFound);
            if (workers == null || lastRegisteredWorker.getId().equals(workers.getId())) {
                for (NewsLetter data : found) {
                    try {
                        String emailSubject = "Wir haben tolle Nachrichten!";
                        String emailContent = "<h1>Neuer Arbeiter eingestellt!</h1>"
                                + "<p>Liebe Kunden,</p>"
                                + "<p>Wir freuen uns, Ihnen mitteilen zu können, dass wir einen neuen Arbeiter in unserem Team haben, der auf den Jobtyp <strong>"
                                + jobTyp + "</strong> spezialisiert ist.</p>";
                             
                               
                                String cleanEmail = data.getCustomerEmail().replace("\"", "");
                        mail.sendHtmlMessage(cleanEmail, emailSubject, emailContent);

                    } catch (MessagingException e) {
                        e.printStackTrace();
                    }
                }
                return true;
            }
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

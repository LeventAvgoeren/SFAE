package com.SFAE.SFAE.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.SFAE.SFAE.DTO.NewsDTO;
import com.SFAE.SFAE.ENDPOINTS.NewsLetterEp;
import com.SFAE.SFAE.ENTITY.NewsLetter;
import com.SFAE.SFAE.ENUM.JobList;
import com.SFAE.SFAE.INTERFACE.NewsLetterRepository;
import com.SFAE.SFAE.Service.NewsLetterService;

@RestController
public class NewLetterController implements NewsLetterEp {

  @Autowired
  private NewsLetterRepository newsLetter;

  @Autowired
  private NewsLetterService newsService;

  @Override
  public ResponseEntity<?> safeEmailToNewsLetter(String emailCustomer) {

    if (emailCustomer == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    try {
      NewsLetter news = new NewsLetter();
      news.setCustomerEmail(emailCustomer);

      newsLetter.save(news);
      return ResponseEntity.status(HttpStatus.OK).build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @Override
  public ResponseEntity<?> sendEmailToCustomer(List<JobList> jobType) {
    if (jobType == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
    try {

      Boolean result = newsService.sendNewsLetter(jobType);
      if (result) {
        return ResponseEntity.status(HttpStatus.OK).build();
      }

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();

  }

  @Override
  public ResponseEntity<?> sendOwnEmailToCustomer(NewsDTO news) {
    try {
      newsService.sendOwnNewsLetter(news.getTitel(), news.getText());
      return ResponseEntity.status(HttpStatus.OK).build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @Override
  public ResponseEntity<?> getAllEmailsSend() {
    try {
      List<NewsLetter> allNews = newsLetter.findAll();
      if (allNews != null) {
        ResponseEntity.status(HttpStatus.OK).body(allNews);
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
  }
}

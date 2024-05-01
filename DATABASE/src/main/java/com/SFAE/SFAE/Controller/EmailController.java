package com.SFAE.SFAE.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.SFAE.SFAE.Service.MailSevice;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private MailSevice emailService;

    @GetMapping("/send")
    public String sendMail(@RequestParam String to, @RequestParam String subject, @RequestParam String text) {
        emailService.sendSimpleMessage(to, subject, text);
        return "Email sent successfully";
    }
}
package com.SFAE.SFAE.ENDPOINTS;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;



@RequestMapping("/api")
public interface ChatBotEP {

  @PostMapping("/chatBot")
  ResponseEntity<?> chatBot(@RequestBody String input);

}

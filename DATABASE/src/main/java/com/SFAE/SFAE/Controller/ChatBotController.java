package com.SFAE.SFAE.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.SFAE.SFAE.ENDPOINTS.ChatBotEP;
import com.SFAE.SFAE.Service.ChatBot;

@Controller
public class ChatBotController  implements ChatBotEP{
  @Autowired
  ChatBot bot;

  @Override
  public ResponseEntity<?> chatBot(String input) {
    System.out.println(input);
    if(input.length()> 100){
      return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("Input is too long. Maximum allowed length is " + 40 + " characters.");
    }

    try {
      String result=bot.bot(input);
      return ResponseEntity.status(HttpStatus.OK).body(result);

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

  }


}

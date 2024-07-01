package com.SFAE.SFAE;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import com.SFAE.SFAE.ENUM.TokenType;

import com.SFAE.SFAE.Security.JWT;
import com.SFAE.SFAE.Service.Authentication;

import com.SFAE.SFAE.Service.PasswordHasher;
import com.SFAE.SFAE.Service.TokenMailService;


import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import com.SFAE.SFAE.DTO.Token;


@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ServiceTests {

  @Autowired
  private Authentication auth;

  @Autowired
  private HttpServletResponse response;

  @Autowired
  PasswordHasher hash;

  @Autowired
  JWT jwt;

  @Autowired
  TokenMailService token;

  @Test
  public void loginWorks() {

    String result = auth.loginCustomer("leventavgoren@gmail.com", "Levent123!", response);
    assertNotNull(result);
    assertNotEquals("a", result);
    assertTrue(result instanceof String);
  }

  @Test
  public void loginWithNoEMail() {
    String result = auth.loginCustomer("", "Levent123!", response);
    assertNull(result);
  }

  @Test
  public void loginWithOutConfirm() {
    String result = auth.loginCustomer("levent@gmail.com", "Levent123!", response);
    assertNotNull(result);
    assertEquals("a", result);
  }

  @Test 
  public void loginWorker(){

    String result=jwt.loginWorkerJWT("playerahmad@gmail.com", "Test123%%");
    assertNotNull(result);
    assertNotEquals("a", result);
    assertTrue(result instanceof String);
  }

  
  @Test
  public void loginWithNoEmailWorker() {
    String result=jwt.loginWorkerJWT("", "Test123%%");
    assertNull(result);
  }

  @Test
  public void loginWithOutConfirmWorker() {

    String result=jwt.loginWorkerJWT("playerahmad@gmail.com", "Test123%%");
    assertNotNull(result);
    assertEquals("a", result);
  }

  @Test
  public void passwordHash(){

   String result = hash.hashPassword("Levent123!");
   assertTrue(result instanceof String);
   assertTrue(result.startsWith("$2a$10$"));

  }

  @Test
  public void passwordHashWithNull(){

   String result = hash.hashPassword("");
   assertNull(result);

  }

  @Test
  public void passwordHashNotStrong(){

   String result = hash.hashPassword("hal");
   assertNull(result);

  }

  @Test
  public void comparePassword(){
    String passwort = "Levent123!";
    String hashedPasswort= hash.hashPassword(passwort);
    assertTrue(hash.comparePassword(hashedPasswort,passwort));
  }
  @Test
  public void comparePasswordWrong(){
    String passwort = "Levent123!";
    String passwortWornghash = hash.hashPassword("adaiudbadih");

    assertFalse(hash.comparePassword(passwortWornghash,passwort));
  }

  @Test
  public void createTokenContract(){
    String result=token.createToken(1, "W1", TokenType.CONTRACT);

    assertNotNull(result);
    assertTrue(result instanceof String);
  
  }

  @Test
  public void createTokenPasswordReset(){
    String result=token.createToken(1, "W1", TokenType.PASSWORDRESET);
    
    assertNotNull(result);
    assertTrue(result instanceof String);
  
  }

  
  @Test
  public void createTokenVerifyCustomerANDWorker(){
    String resultCustomer=token.createToken(1, "W1", TokenType.VERIFYCUSTOMER);
    String resultWorker=token.createToken(1, "W1", TokenType.VERIFYWORKER);

    assertAll(
      ()-> assertNotNull(resultWorker),
      ()-> assertNotNull(resultCustomer),
      ()-> assertTrue(resultCustomer instanceof String),
      ()-> assertTrue(resultWorker instanceof String)
    );
  
  }

  @Test
  public void validateToken(){
    String result=token.createToken(1, "W1", TokenType.PASSWORDRESET);
    Token tok=token.validateToken(result);
   
    assertAll(
      ()-> assertNotNull(tok),
      ()-> assertTrue(tok instanceof Token)
    );
  }

  @Test
  public void validateTokenNull(){
    String result="null";
    Token tok=token.validateToken(result);

    assertNull(tok);
   
  }





}

package com.SFAE.SFAE.Service;

import java.util.Set;
import java.text.Normalizer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class ChatBot{
 private static final Set<String> actions = new HashSet<>(Arrays.asList("bezahlen", "registrieren", "anmelden", "ablehnen", "akzeptieren", "finden", "suchen", "verbessern","erstellen"));
  private static final Set<String> fees = new HashSet<>(Arrays.asList("gebuehren", "gehalt"));
  private static final Set<String> conditions = new HashSet<>(Arrays.asList("kein", "nicht", "vorhanden"));
  private static final Set<String> interrogatives = new HashSet<>(Arrays.asList("wie", "was", "wo", "wann", "warum", "wer", "wen", "wem", "welche", "welcher", "welches"));
  private static final Set<String> entities = new HashSet<>(Arrays.asList("customer", "worker"));
  private static final Set<String> evaluations = new HashSet<>(Arrays.asList("konflikte", "sichtbarkeit", "bewertung"));
  private static final Set<String> auftragActions = new HashSet<>(Arrays.asList("auftrag","contract","formular"));

  // Unterteilte actions Listen
  private static final Set<String> financialActions = new HashSet<>(Arrays.asList("bezahlen"));
  private static final Set<String> registrationActions = new HashSet<>(Arrays.asList("registrieren", "anmelden"));
  private static final Set<String> decisionActions = new HashSet<>(Arrays.asList("ablehnen", "akzeptieren"));
  private static final Set<String> searchActions = new HashSet<>(Arrays.asList("finden", "suchen"));
  private static final Set<String> improvementActions = new HashSet<>(Arrays.asList("verbessern"));

  
/**
 * Wörter: bezahlen, registrieren, anmelden, gebühren, ablehnen, akzeptieren, konflikte, sichtbarkeit, gehalt, Customer, Worker, kein, nicht, vorhanden, finden, suchen, wie,verbessern,Bewertung
 * 
 * / Der Customer will nicht bezahlen.
 * / Wie kann ich ein Worker finden?
 * / Wie kann ich mich als Customer registrieren?  
 * / Gibt es gebühren, wenn ich bezahle?
 * / Wie kann ich meine Bewertung verbessern?
 * / Wo kann ich mich als worker Registrieren?
 * / Wo kann ich mich als worker Anmelden?
 * / Wie kann ich einen auftrag erstellen 
 * / Ich kann kein auftrag erstellen 
 * / Ich kann mich nicht anmelden 
 * / Ich kann micht nicht registrieren
 */
  public String bot (String input){
    input = replaceUmlauts(input); 
    Boolean einkommen=false;
    Boolean isCustomer=false;
    
    Boolean entscheidung=false;
    Boolean vorgeschlagen=false;
    Boolean verneinung=false;
    Boolean frageWort=false;
    Boolean bewertung=false;
    Boolean veraenderung=false;
    
    Boolean auftragAct=false;
    Boolean auftrag=false;
    Boolean suche=false;
    Boolean registrieren=false;
    Boolean anmelden=false;
    Boolean abgaben=false;
    Boolean konflikte=false;
   
    String output = input.replaceAll("[^a-zA-Z0-9\\s]", "");
    String[] splitted=output.split("\\s+");


 
    for (String word : splitted) {
      word= word.toLowerCase();
      if (interrogatives.contains(word)) {
        frageWort = true;
        continue;
      }
      if (entities.contains(word)) {
        if (word.equals("customer")) {
          isCustomer = true;
          continue;
        }
        
      }
      if (conditions.contains(word)) {
        verneinung = true;
        continue;
      }
      if (actions.contains(word)) {
        if (financialActions.contains(word)) {
          einkommen = true;

        }
        if (registrationActions.contains(word)) {
          if (word.equals("registrieren")) {
            registrieren = true;
          } else {
            anmelden = true;
        
          }
         
        }
        if (decisionActions.contains(word)) {
          entscheidung = true;

        }
        if (searchActions.contains(word)) {
          suche = true;
        }
        if (improvementActions.contains(word)) {
          veraenderung = true;
        }
        if(word.equals("erstellen")){
          auftragAct=true;
        }
      }
      if(auftragActions.contains(word)){
        auftrag=true;
      }
      if (evaluations.contains(word)) {
        bewertung = true;
      }
      if (fees.contains(word)) {
        einkommen = true;
      }
    }

      if (frageWort && isCustomer && registrieren) {
          return "Sie können sich hier <a href='https://localhost:3000/registration/customer'>registrieren</a>.";
      }
      if (frageWort && !isCustomer && registrieren) {
          return "Sie können sich hier <a href='https://localhost:3000/registration/worker'>registrieren</a>.";
      }
      if (frageWort && isCustomer && anmelden) {
          return "Sie können sich hier <a href='https://localhost:3000/login'>anmelden</a>.";
      }
      if (frageWort && !isCustomer && anmelden) {
          return "Sie können sich hier <a href='https://localhost:3000/login'>anmelden</a>.";
      }


      if (frageWort && !isCustomer && suche) {
          return "Ein Worker wird automatisch durch SFAE für Sie gesucht. Erstellen Sie einfach einen Auftrag, und wir suchen den preis-leistungs-besten Worker anhand seiner Bewertung, Reichweite und maximalen Bezahlung.";
      }
      if (frageWort && einkommen && fees.contains("gebuehren")) {
          return "Ja, es gibt minimale Gebühren von 2.5%. Ihr Gehalt erhalten Sie immer am 28. des jeweiligen Monats.";
      }
      if (frageWort && bewertung && veraenderung) {
          return "Sie können Ihre Bewertung verbessern, indem der Kunde Sie gut bewertet.";
      }
      if (verneinung && isCustomer && einkommen) {
          return "Wenden Sie sich bitte an unseren Support und schildern Sie den Ablauf genau.";
      }
      if (frageWort && auftrag) {
          return "Gehen Sie auf die auftrag erstellen seite und füllen Sie alle notwendigen Felder aus. Wenn Fehler auftreten, wird SFAE Ihnen erklären, was genau Sie anpassen sollen.";
      }
      if (auftrag && verneinung) {
          return "Wenden Sie sich bitte an den Support (Sfae@gmail.com) oder probieren Sie folgende Schritte: 1. Passen Sie die Reichweite an. 2. Passen Sie den gewünschten Jobtyp an. 3. Passen Sie Ihre maximale Zahlung an.";
      }
      if ((frageWort && anmelden && verneinung) || (anmelden && verneinung)) {
          return "Wenn Sie Probleme bei der Anmeldung haben, probieren Sie Ihre Email zu bestätigen oder Ihr Passwort zurückzusetzen auf folgender Seite <a href='https://localhost:3000/passwordreset'>Passwort zurücksetzen</a>. Sie werden nun eine Email kriegen klicken sie drauf und geben sie ein neues passwort ein.Wenn beide Maßnahmen nicht helfen, wenden Sie sich bitte an den Support (Sfae@gmail.com).";
      }
      if ((verneinung && registrieren) || (frageWort && registrieren && verneinung)) {
          return "Wenn Sie keinen neuen Account erstellen können, probieren Sie eine gültige Email-Adresse anzugeben, um später die Email zu bestätigen. Verwenden Sie ein starkes Passwort, das 8 Zeichen, ein Sonderzeichen und eine Zahl enthält.";
      }
      if (einkommen && fees.contains("gebuehren")) {
          return "Sie bezahlen minimale Gebühren von 2.5%. Ihr Gehalt erhalten Sie immer am 28. des jeweiligen Monats.";
      }







    
    if(einkommen && fees.contains("gebuehren")){
      return "Sie bezahlen minimale Gebühren von 2.5%. Und ihr Gehlt erhalten Sie immer am 28. des jeweiligen Monats.";
    }
  
    

    return "Ich habe Ihre Anfrage nicht verstanden. Bitte formulieren Sie es einmal anders.";
  }


  

    public static String replaceUmlauts(String input) {
      Map<Character, String> umlautMap = new HashMap<>();
 
          umlautMap.put('ä', "ae");
          umlautMap.put('ö', "oe");
          umlautMap.put('ü', "ue");
          umlautMap.put('Ä', "Ae");
          umlautMap.put('Ö', "Oe");
          umlautMap.put('Ü', "Ue");
          umlautMap.put('ß', "ss");
      
        StringBuilder result = new StringBuilder();
        for (char c : input.toCharArray()) {
            if (umlautMap.containsKey(c)) {
                result.append(umlautMap.get(c));
            } else {
                result.append(c);
            }
        }
        return result.toString();
    }

    
}
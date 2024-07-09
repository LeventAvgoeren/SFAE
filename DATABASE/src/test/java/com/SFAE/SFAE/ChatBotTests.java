package com.SFAE.SFAE;


import static org.junit.Assert.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.SFAE.SFAE.Service.ChatBot;



@SpringBootTest
public class ChatBotTests {

    @Autowired
    ChatBot chatbot;

     @Test
    public void testChatBot(){

        String output =chatbot.bot("Wie kann ich ein Worker finden ?");

         String expectedText = "Ein worker wird automatisch durch SFAE für sie gesucht erstellen sie einfach einen Auftrag und wir suchen ihnen den preis leistungs besten worker anhand seiner bewertung,angabe der reichweite und angabe der maximalen bezahlung";
        assertTrue(expectedText, output.equals(expectedText));
   }



   @Test
   public void testChatBot2(){

       String output =chatbot.bot("Gibt es gebühren wenn ich bezahle ?");

        String expectedText = "Sie bezahlen minimale Gebühren von 2.5%. Und ihr Gehlt erhalten Sie immer am 28. des jeweiligen Monats.";
       assertTrue(expectedText, output.equals(expectedText));
  }

  @Test
  public void testChatBot3(){

      String output =chatbot.bot("Wie kann ich mich als Customer registrieren");

       String expectedText = "Sie können sich hier <Link> registrieren.";
      assertTrue(expectedText, output.equals(expectedText));
 }

 @Test
 public void testChatBot4(){

     String output =chatbot.bot(" Wo kann ich mich als worker Registrieren?");

      String expectedText = "Sie können sich hier <Link> registrieren.";
     assertTrue(expectedText, output.equals(expectedText));
}

@Test
 public void testChatBot5(){

     String output =chatbot.bot("Wo kann ich mich als customer Anmelden?");

      String expectedText = "Sie können sich hier <Link> anmelden.";
     assertTrue(expectedText, output.equals(expectedText));
}
@Test
 public void testChatBot6(){

     String output =chatbot.bot(" Wo kann ich mich als worker Anmelden?");

      String expectedText = "Sie können sich hier <Link> anmelden.";
     assertTrue(expectedText, output.equals(expectedText));
}

@Test
 public void testChatBot7(){

     String output =chatbot.bot("Wie kann ich meine Bewertung verbessern?");

      String expectedText = "Sie können ihre Bewertung verbessern, indem der Kunde Sie gut bewertet.";
     assertTrue(expectedText, output.equals(expectedText));
}

@Test
 public void testChatBot8(){

     String output =chatbot.bot("Der Customer will nicht bezahlen");

      String expectedText = "Wenden sie sich bitte an unseren support schildern die den ablauf genau";
     assertTrue(expectedText, output.equals(expectedText));
}

@Test
 public void testChatBot9(){

     String output =chatbot.bot("Wie kann ich einen auftrag erstellen ");

      String expectedText = "Gehen sie auf die folgende seite <Link> und füllen sie alle notwendigen felder aus wenn fehler enstehen wird sfae ihnen erklären was genau sie anpassen sollen";
     assertTrue(expectedText, output.equals(expectedText));
}
@Test
 public void testChatBot10(){

     String output =chatbot.bot("Ich kann kein auftrag erstellen");

      String expectedText = "Wenden sie sich bitte an den support Sfae@gmail.com oder probieren sie folgende schritte 1. passen sie die reichweite an 2. passen sie den gwünschten job typen an 3. passen ihre maximale zahlung an";
     assertTrue(expectedText, output.equals(expectedText));
}
@Test
 public void testChatBot11(){

     String output =chatbot.bot("Ich kann mich nicht anmelden ");

     String expectedText = "Wenn sie probleme bei der anmeldung haben probieren sie ihre email zu bestätigen oder ihr passwort zurück zu setzen wenn beide sachen nicht helfen konnten wenden sie sich an folgenden support Sfae@gmail.com die werden ihnen weiter helfen";
     assertTrue(expectedText, output.equals(expectedText));

     String output1 =chatbot.bot("Als customer kann ich mich nicht anmelden ");

     String expectedText1 = "Wenn sie probleme bei der anmeldung haben probieren sie ihre email zu bestätigen oder ihr passwort zurück zu setzen wenn beide sachen nicht helfen konnten wenden sie sich an folgenden support Sfae@gmail.com die werden ihnen weiter helfen";
     assertTrue(expectedText1, output1.equals(expectedText1));

     String output2 =chatbot.bot("Wenn ich mich als customer anmelden will funktioniert es nicht");

     String expectedText2 = "Wenn sie probleme bei der anmeldung haben probieren sie ihre email zu bestätigen oder ihr passwort zurück zu setzen wenn beide sachen nicht helfen konnten wenden sie sich an folgenden support Sfae@gmail.com die werden ihnen weiter helfen";
     assertTrue(expectedText2, output2.equals(expectedText2));
}

@Test
 public void testChatBot12(){

     String output =chatbot.bot("Ich kann micht nicht registrieren");

      String expectedText = "Wenn sie keinen neuen account erstellen können probieren sie eine gültige email addresse anzugeben um später die email zu bestätigen zu dem verwenden sie ein starkes passwort damit sie sicher sind diese sollte 8 zeichen ein sonderzeichen und eine zahl beinhalten";
     assertTrue(expectedText, output.equals(expectedText));

     String output1 =chatbot.bot("Ich kann mich nicht registrieren wenn ich es probiere");

      String expectedText1 = "Wenn sie keinen neuen account erstellen können probieren sie eine gültige email addresse anzugeben um später die email zu bestätigen zu dem verwenden sie ein starkes passwort damit sie sicher sind diese sollte 8 zeichen ein sonderzeichen und eine zahl beinhalten";
     assertTrue(expectedText1, output.equals(expectedText1));
}

}
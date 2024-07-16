package com.SFAE.SFAE.Service;

import java.sql.Connection;
import java.sql.SQLException;

import org.postgresql.largeobject.LargeObject;
import org.postgresql.largeobject.LargeObjectManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import io.jsonwebtoken.io.IOException;



/**
 * Service class for managing image storage and retrieval using PostgreSQL Large Objects.
 * @author leventavgoren
 */
@Service
public class PictureService {
  
@Autowired
private JdbcTemplate jdbcTemplate;


  /**
   * Reads a large object from the database.
   * 
   * @param oid The object identifier of the large object.
   * @return A byte array containing the image data, or null if an error occurs.
   */
  @SuppressWarnings("null")
  public byte[] readLargeObject(int oid) {
    Connection conn = null;
    LargeObjectManager lobjManager = null;
    LargeObject lobj = null;
    byte[] imageBytes = null;

    try {
      // Verbindung holen
      conn = DataSourceUtils.getConnection(jdbcTemplate.getDataSource());
      System.out.println("Connection established: " + (conn != null));

      // Auto-commit deaktivieren
      conn.setAutoCommit(false);

      // PostgreSQL LargeObject API verwenden
      lobjManager = conn.unwrap(org.postgresql.PGConnection.class).getLargeObjectAPI();
      System.out.println("LargeObjectManager obtained: " + (lobjManager != null));

      // LargeObject öffnen
      if (lobjManager != null) {
        try {
          lobj = lobjManager.open((long) oid, LargeObjectManager.READ);
          System.out.println("LargeObject opened: " + (lobj != null));
        } catch (SQLException e) {
          System.err.println("SQL Exception occurred while opening large object with OID " + oid);
          e.printStackTrace();
          return null;
        }

        // Länge des LargeObject abfragen
        if (lobj != null) {
          try {
            int size = (int) lobj.size();
            imageBytes = new byte[size];

            // LargeObject lesen
            int bytesRead = lobj.read(imageBytes, 0, size);
            System.out.println("Bytes read: " + bytesRead);
          } catch (SQLException e) {
            System.err.println("SQL Exception occurred while reading large object with OID " + oid);
            e.printStackTrace();
            return null;
          }
        } else {
          System.out.println("No Large Object found with OID: " + oid);
        }
      } else {
        System.out.println("Failed to obtain LargeObjectManager");
      }
    } catch (SQLException e) {
      System.err.println("SQL Exception occurred while reading large object with OID " + oid);
      e.printStackTrace();
    } finally {
      if (lobj != null) {
        try {
          lobj.close();
        } catch (SQLException e) {
          System.err.println("SQL Exception occurred while closing large object with OID " + oid);
          e.printStackTrace();
        }
      }
      if (conn != null) {
        try {
          // Auto-commit wieder aktivieren
          conn.setAutoCommit(true);
          conn.close();
        } catch (SQLException e) {
          System.err.println("SQL Exception occurred while closing connection");
          e.printStackTrace();
        }
      }
    }

    return imageBytes;
  }


  /**
   * Saves an image as a large object in the database.
   * 
   * @param imageBytes The byte array containing the image data.
   * @return The object identifier of the saved large object.
   * @throws SQLException if a database access error occurs.
   * @throws IOException if an I/O error occurs.
   */
  @SuppressWarnings("null")
  public Long saveImageAsLargeObject(byte[] imageBytes) throws SQLException, IOException {
    Connection conn = null;
    Long oid = null;

    try {
        conn = DataSourceUtils.getConnection(jdbcTemplate.getDataSource());
        // Deactivate auto-commit mode
        conn.setAutoCommit(false);

        LargeObjectManager lobjManager = conn.unwrap(org.postgresql.PGConnection.class).getLargeObjectAPI();
        oid = lobjManager.createLO(LargeObjectManager.WRITE);
        LargeObject lobj = lobjManager.open(oid, LargeObjectManager.WRITE);

        lobj.write(imageBytes);
        lobj.close();

        // Commit the transaction
        conn.commit();
    } catch (SQLException | IOException e) {
        if (conn != null) {
            try {
                // Rollback the transaction on error
                conn.rollback();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
        throw e;
    } finally {
        if (conn != null) {
            try {
                // Re-enable auto-commit mode
                conn.setAutoCommit(true);
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            // Do not close the connection manually, let JdbcTemplate manage it
        }
    }

    return oid;
}


/**
 * Loads the default profile picture from the classpath.
 * 
 * @return A byte array containing the default profile picture data.
 * @throws java.io.IOException if an I/O error occurs.
 */
public byte[] loadDefaultProfilePicture() throws java.io.IOException {

    try {
      ClassPathResource imgFile = new ClassPathResource("static/images/default_profile.jpeg");
      return StreamUtils.copyToByteArray(imgFile.getInputStream());
    } catch (IOException e) {
      e.printStackTrace();
      return new byte[0];
    }
  }

}

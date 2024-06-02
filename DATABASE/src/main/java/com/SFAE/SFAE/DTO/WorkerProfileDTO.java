package com.SFAE.SFAE.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerProfileDTO {
  private String id;
  private String name;
  private String profileBase64;
  private String location;
  private String email;
  private String password;
  private String slogan;
  private Double latitude;
  private Double longitude;
}

package com.SFAE.SFAE.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerPrefrencesDTO {
  String id;
  Double range;
  String[] jobType;
  Double minPayment;

}

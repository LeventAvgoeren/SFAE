package com.SFAE.SFAE.DTO;


import lombok.Data;

@Data
public class WorkerDTO {
 
  
    private String id;
    private String name;
    private String location;
    private String password;
    private String email;
    private String status;
    private String statusOrder;
    private Double range;
    private String[] jobType;
    private Double minPayment;
    private Double rating;
    private Boolean verification;
    private Double latitude;
    private Double longitude;
    private String profileBase64;
    private String slogan;
    

   
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusOrder() {
        return statusOrder;
    }

    public void setStatusOrder(String statusOrder) {
        this.statusOrder = statusOrder;
    }

    public Double getRange() {
        return range;
    }

    public void setRange(Double range) {
        this.range = range;
    }

    public String[] getJobType() {
        return jobType;
    }

    public void setJobType(String[] jobType) {
        this.jobType = jobType;
    }

    public Double getMinPayment() {
        return minPayment;
    }

    public void setMinPayment(Double minPayment) {
        this.minPayment = minPayment;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Boolean getVerification() {
        return verification;
    }

    public void setVerification(Boolean verification) {
        this.verification = verification;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getProfileBase64() {
        return profileBase64;
    }

    public void setProfileBase64(String profileBase64) {
        this.profileBase64 = profileBase64;
    }
}

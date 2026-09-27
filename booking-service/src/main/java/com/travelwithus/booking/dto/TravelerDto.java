package com.travelwithus.booking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TravelerDto {

    private Long id;

    @NotBlank(message = "Traveler full name is required")
    private String fullName;

    @NotNull(message = "Traveler age is required")
    @Min(value = 0, message = "Age cannot be negative")
    private Integer age;

    private String gender;

    private String passportOrIdNumber;

    private boolean primaryContact = false;

    public TravelerDto() {
    }

    public TravelerDto(String fullName, Integer age, String gender, String passportOrIdNumber, boolean primaryContact) {
        this.fullName = fullName;
        this.age = age;
        this.gender = gender;
        this.passportOrIdNumber = passportOrIdNumber;
        this.primaryContact = primaryContact;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPassportOrIdNumber() {
        return passportOrIdNumber;
    }

    public void setPassportOrIdNumber(String passportOrIdNumber) {
        this.passportOrIdNumber = passportOrIdNumber;
    }

    public boolean isPrimaryContact() {
        return primaryContact;
    }

    public void setPrimaryContact(boolean primaryContact) {
        this.primaryContact = primaryContact;
    }
}

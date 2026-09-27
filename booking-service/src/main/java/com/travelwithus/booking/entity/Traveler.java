package com.travelwithus.booking.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "travelers")
public class Traveler {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    @JsonBackReference
    private Booking booking;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false)
    private Integer age;

    @Column(length = 20)
    private String gender;

    @Column(length = 50)
    private String passportOrIdNumber;

    @Column(nullable = false)
    private boolean primaryContact = false;

    public Traveler() {
    }

    public Traveler(String fullName, Integer age, String gender, String passportOrIdNumber, boolean primaryContact) {
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

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
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

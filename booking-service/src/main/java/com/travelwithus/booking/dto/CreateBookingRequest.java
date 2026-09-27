package com.travelwithus.booking.dto;

import com.travelwithus.booking.entity.BookingType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class CreateBookingRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Customer email must be valid")
    private String customerEmail;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    private String customerPhone;

    @NotNull(message = "Booking type is required")
    private BookingType bookingType;

    @NotNull(message = "Item reference ID is required")
    private Long itemReferenceId;

    @NotBlank(message = "Item title is required")
    private String itemTitle;

    private Long roomTypeId;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Number of guests is required")
    @Min(value = 1, message = "At least one guest is required")
    private Integer numberOfGuests;

    private Integer numberOfRooms;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "1.00", message = "Total amount must be greater than zero")
    private BigDecimal totalAmount;

    private String specialRequests;

    @NotEmpty(message = "At least one traveler detail must be provided")
    @Valid
    private List<TravelerDto> travelers = new ArrayList<>();

    public CreateBookingRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public BookingType getBookingType() {
        return bookingType;
    }

    public void setBookingType(BookingType bookingType) {
        this.bookingType = bookingType;
    }

    public Long getItemReferenceId() {
        return itemReferenceId;
    }

    public void setItemReferenceId(Long itemReferenceId) {
        this.itemReferenceId = itemReferenceId;
    }

    public String getItemTitle() {
        return itemTitle;
    }

    public void setItemTitle(String itemTitle) {
        this.itemTitle = itemTitle;
    }

    public Long getRoomTypeId() {
        return roomTypeId;
    }

    public void setRoomTypeId(Long roomTypeId) {
        this.roomTypeId = roomTypeId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public Integer getNumberOfRooms() {
        return numberOfRooms;
    }

    public void setNumberOfRooms(Integer numberOfRooms) {
        this.numberOfRooms = numberOfRooms;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }

    public List<TravelerDto> getTravelers() {
        return travelers;
    }

    public void setTravelers(List<TravelerDto> travelers) {
        this.travelers = travelers;
    }
}

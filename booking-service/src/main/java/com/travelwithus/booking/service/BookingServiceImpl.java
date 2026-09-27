package com.travelwithus.booking.service;

import com.travelwithus.booking.client.HotelClient;
import com.travelwithus.booking.client.PackageClient;
import com.travelwithus.booking.dto.*;
import com.travelwithus.booking.entity.*;
import com.travelwithus.booking.exception.BookingException;
import com.travelwithus.booking.exception.ResourceNotFoundException;
import com.travelwithus.booking.repository.BookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingServiceImpl.class);
    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final BookingRepository bookingRepository;
    private final PackageClient packageClient;
    private final HotelClient hotelClient;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              PackageClient packageClient,
                              HotelClient hotelClient) {
        this.bookingRepository = bookingRepository;
        this.packageClient = packageClient;
        this.hotelClient = hotelClient;
    }

    @Override
    public BookingResponseDto createBooking(CreateBookingRequest request) {
        log.info("Creating booking for user={}, type={}, item={}", request.getUserId(), request.getBookingType(), request.getItemReferenceId());

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BookingException("Booking start date cannot be after end date");
        }

        // Reserve inventory in downstream service
        if (request.getBookingType() == BookingType.PACKAGE) {
            try {
                packageClient.reserveSlots(request.getItemReferenceId(), request.getNumberOfGuests());
            } catch (Exception e) {
                log.warn("Failed to reserve package slots: {}", e.getMessage());
            }
        } else if (request.getBookingType() == BookingType.HOTEL && request.getRoomTypeId() != null) {
            try {
                int rooms = (request.getNumberOfRooms() != null && request.getNumberOfRooms() > 0) ? request.getNumberOfRooms() : 1;
                hotelClient.reserveRoom(request.getRoomTypeId(), rooms);
            } catch (Exception e) {
                log.warn("Failed to reserve hotel room: {}", e.getMessage());
            }
        }

        Booking booking = new Booking();
        booking.setBookingNumber(generateUniqueBookingNumber());
        booking.setUserId(request.getUserId());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerPhone(request.getCustomerPhone());
        booking.setBookingType(request.getBookingType());
        booking.setItemReferenceId(request.getItemReferenceId());
        booking.setItemTitle(request.getItemTitle());
        booking.setRoomTypeId(request.getRoomTypeId());
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setNumberOfGuests(request.getNumberOfGuests());
        booking.setNumberOfRooms(request.getNumberOfRooms() != null ? request.getNumberOfRooms() : 1);
        booking.setTotalAmount(request.getTotalAmount());
        booking.setSpecialRequests(request.getSpecialRequests());
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.PENDING);

        if (request.getTravelers() != null) {
            for (TravelerDto travelerDto : request.getTravelers()) {
                Traveler traveler = new Traveler(
                        travelerDto.getFullName(),
                        travelerDto.getAge(),
                        travelerDto.getGender(),
                        travelerDto.getPassportOrIdNumber(),
                        travelerDto.isPrimaryContact()
                );
                booking.addTraveler(traveler);
            }
        }

        Booking saved = bookingRepository.save(booking);
        log.info("Booking created successfully with bookingNumber: {}", saved.getBookingNumber());
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDto getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
        return mapToDto(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDto getBookingByNumber(String bookingNumber) {
        Booking booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with booking number: " + bookingNumber));
        return mapToDto(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponseDto> getUserBookings(Long userId, Pageable pageable) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToDto);
    }

    @Override
    public BookingResponseDto cancelBooking(Long id, Long userId, CancelBookingRequest request) {
        log.info("Cancelling booking id={}, requested by user={}", id, userId);

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        if (userId != null && !userId.equals(booking.getUserId())) {
            throw new BookingException("Unauthorized: Booking does not belong to user " + userId);
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BookingException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(request.getReason());
        booking.setCancelledAt(LocalDateTime.now());

        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            booking.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        // Release inventory in downstream service
        if (booking.getBookingType() == BookingType.PACKAGE) {
            try {
                packageClient.releaseSlots(booking.getItemReferenceId(), booking.getNumberOfGuests());
            } catch (Exception e) {
                log.warn("Failed to release package slots: {}", e.getMessage());
            }
        } else if (booking.getBookingType() == BookingType.HOTEL && booking.getRoomTypeId() != null) {
            try {
                int rooms = (booking.getNumberOfRooms() != null && booking.getNumberOfRooms() > 0) ? booking.getNumberOfRooms() : 1;
                hotelClient.releaseRoom(booking.getRoomTypeId(), rooms);
            } catch (Exception e) {
                log.warn("Failed to release hotel room: {}", e.getMessage());
            }
        }

        Booking updated = bookingRepository.save(booking);
        log.info("Booking cancelled successfully: {}", updated.getBookingNumber());
        return mapToDto(updated);
    }

    @Override
    public BookingResponseDto updatePaymentStatus(String bookingNumber, UpdatePaymentStatusRequest request) {
        log.info("Updating payment status for bookingNumber: {} to {}", bookingNumber, request.getPaymentStatus());

        Booking booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with booking number: " + bookingNumber));

        booking.setPaymentStatus(request.getPaymentStatus());
        booking.setPaymentTransactionId(request.getPaymentTransactionId());

        if (request.getPaymentStatus() == PaymentStatus.PAID && booking.getStatus() == BookingStatus.PENDING) {
            booking.setStatus(BookingStatus.CONFIRMED);
        }

        Booking updated = bookingRepository.save(booking);
        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponseDto> getAllBookings(BookingStatus status, Pageable pageable) {
        return bookingRepository.findAllWithFilter(status, pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingStatsDto getBookingStats() {
        long total = bookingRepository.count();
        long confirmed = bookingRepository.countByStatus(BookingStatus.CONFIRMED);
        long pending = bookingRepository.countByStatus(BookingStatus.PENDING);
        long cancelled = bookingRepository.countByStatus(BookingStatus.CANCELLED);
        long completed = bookingRepository.countByStatus(BookingStatus.COMPLETED);
        BigDecimal revenue = bookingRepository.calculateTotalConfirmedRevenue();

        return new BookingStatsDto(total, confirmed, pending, cancelled, completed, revenue);
    }

    private String generateUniqueBookingNumber() {
        String bookingNumber;
        do {
            StringBuilder sb = new StringBuilder("TWU-BKG-");
            for (int i = 0; i < 8; i++) {
                sb.append(ALPHANUMERIC.charAt(RANDOM.nextInt(ALPHANUMERIC.length())));
            }
            bookingNumber = sb.toString();
        } while (bookingRepository.findByBookingNumber(bookingNumber).isPresent());
        return bookingNumber;
    }

    private BookingResponseDto mapToDto(Booking booking) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setId(booking.getId());
        dto.setBookingNumber(booking.getBookingNumber());
        dto.setUserId(booking.getUserId());
        dto.setCustomerEmail(booking.getCustomerEmail());
        dto.setCustomerName(booking.getCustomerName());
        dto.setCustomerPhone(booking.getCustomerPhone());
        dto.setBookingType(booking.getBookingType());
        dto.setItemReferenceId(booking.getItemReferenceId());
        dto.setItemTitle(booking.getItemTitle());
        dto.setRoomTypeId(booking.getRoomTypeId());
        dto.setStartDate(booking.getStartDate());
        dto.setEndDate(booking.getEndDate());
        dto.setNumberOfGuests(booking.getNumberOfGuests());
        dto.setNumberOfRooms(booking.getNumberOfRooms());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setPaymentTransactionId(booking.getPaymentTransactionId());
        dto.setSpecialRequests(booking.getSpecialRequests());
        dto.setCancellationReason(booking.getCancellationReason());
        dto.setCancelledAt(booking.getCancelledAt());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());

        if (booking.getTravelers() != null) {
            List<TravelerDto> travelers = booking.getTravelers().stream().map(t -> {
                TravelerDto td = new TravelerDto();
                td.setId(t.getId());
                td.setFullName(t.getFullName());
                td.setAge(t.getAge());
                td.setGender(t.getGender());
                td.setPassportOrIdNumber(t.getPassportOrIdNumber());
                td.setPrimaryContact(t.isPrimaryContact());
                return td;
            }).collect(Collectors.toList());
            dto.setTravelers(travelers);
        }

        return dto;
    }
}

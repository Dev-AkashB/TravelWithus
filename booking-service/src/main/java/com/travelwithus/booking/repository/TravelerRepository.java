package com.travelwithus.booking.repository;

import com.travelwithus.booking.entity.Traveler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelerRepository extends JpaRepository<Traveler, Long> {
    List<Traveler> findByBookingId(Long bookingId);
}

package com.travelwithus.payment.service;

import com.travelwithus.payment.client.BookingClient;
import com.travelwithus.payment.dto.ProcessPaymentRequest;
import com.travelwithus.payment.dto.RefundRequestDto;
import com.travelwithus.payment.entity.Payment;
import com.travelwithus.payment.entity.PaymentMethod;
import com.travelwithus.payment.entity.PaymentStatus;
import com.travelwithus.payment.gateway.MockStripeRazorpayGateway;
import com.travelwithus.payment.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private BookingClient bookingClient;

    private MockStripeRazorpayGateway paymentGateway;
    private PaymentServiceImpl paymentService;

    @BeforeEach
    void setUp() {
        paymentGateway = new MockStripeRazorpayGateway();
        paymentService = new PaymentServiceImpl(paymentRepository, paymentGateway, bookingClient);
    }

    @Test
    void testProcessPayment_Success() {
        ProcessPaymentRequest request = new ProcessPaymentRequest();
        request.setBookingId(10L);
        request.setBookingNumber("TWU-BKG-TEST9999");
        request.setUserId(1L);
        request.setCustomerEmail("traveler@travelwithus.com");
        request.setAmount(new BigDecimal("1299.00"));
        request.setPaymentMethod(PaymentMethod.CREDIT_CARD);
        request.setCardNumber("4242 4242 4242 4242");
        request.setExpiryMonth("12");
        request.setExpiryYear("2028");
        request.setCvv("123");

        when(paymentRepository.findByPaymentReference(any())).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment p = invocation.getArgument(0);
            p.setId(1L);
            return p;
        });

        var response = paymentService.processPayment(request);

        assertNotNull(response);
        assertEquals(PaymentStatus.SUCCESS, response.getStatus());
        assertEquals("4242", response.getCardLastFour());
        assertNotNull(response.getTransactionId());
        assertTrue(response.getTransactionId().startsWith("ch_stripe_"));

        verify(bookingClient, times(1)).updateBookingPaymentStatus(eq("TWU-BKG-TEST9999"), any());
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    void testProcessPayment_DeclinedCard() {
        ProcessPaymentRequest request = new ProcessPaymentRequest();
        request.setBookingNumber("TWU-BKG-TEST9999");
        request.setUserId(1L);
        request.setAmount(new BigDecimal("500.00"));
        request.setPaymentMethod(PaymentMethod.CREDIT_CARD);
        request.setCardNumber("4000 0000 0000 0002"); // Trigger decline

        when(paymentRepository.findByPaymentReference(any())).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = paymentService.processPayment(request);

        assertEquals(PaymentStatus.FAILED, response.getStatus());
        assertNotNull(response.getFailureReason());
        verify(bookingClient, never()).updateBookingPaymentStatus(any(), any());
    }

    @Test
    void testRefundPayment_Success() {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setPaymentReference("TWU-PAY-REF12345");
        payment.setBookingNumber("TWU-BKG-TEST9999");
        payment.setAmount(new BigDecimal("1299.00"));
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setTransactionId("ch_stripe_test123");

        when(paymentRepository.findByPaymentReference("TWU-PAY-REF12345")).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RefundRequestDto refundRequest = new RefundRequestDto(new BigDecimal("1299.00"), "User requested cancellation");
        var response = paymentService.refundPayment("TWU-PAY-REF12345", refundRequest);

        assertEquals(PaymentStatus.REFUNDED, response.getStatus());
        assertEquals(new BigDecimal("1299.00"), response.getRefundedAmount());
        assertNotNull(response.getRefundTransactionId());
        verify(bookingClient, times(1)).updateBookingPaymentStatus(eq("TWU-BKG-TEST9999"), any());
    }
}

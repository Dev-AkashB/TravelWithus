package com.travelwithus.payment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelwithus.payment.dto.PaymentResponseDto;
import com.travelwithus.payment.dto.ProcessPaymentRequest;
import com.travelwithus.payment.entity.PaymentMethod;
import com.travelwithus.payment.entity.PaymentStatus;
import com.travelwithus.payment.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PaymentController.class)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PaymentService paymentService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void testProcessPaymentEndpoint_Success() throws Exception {
        ProcessPaymentRequest request = new ProcessPaymentRequest();
        request.setBookingId(10L);
        request.setBookingNumber("TWU-BKG-ABCD1234");
        request.setUserId(1L);
        request.setAmount(new BigDecimal("1299.00"));
        request.setPaymentMethod(PaymentMethod.CREDIT_CARD);
        request.setCardNumber("4242424242424242");

        PaymentResponseDto response = new PaymentResponseDto();
        response.setId(1L);
        response.setPaymentReference("TWU-PAY-ABCD1234");
        response.setBookingNumber("TWU-BKG-ABCD1234");
        response.setAmount(new BigDecimal("1299.00"));
        response.setStatus(PaymentStatus.SUCCESS);
        response.setPaymentMethod(PaymentMethod.CREDIT_CARD);

        when(paymentService.processPayment(any(ProcessPaymentRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/payments/process")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.paymentReference").value("TWU-PAY-ABCD1234"))
                .andExpect(jsonPath("$.status").value("SUCCESS"));
    }

    @Test
    void testGetPaymentByReferenceEndpoint() throws Exception {
        PaymentResponseDto response = new PaymentResponseDto();
        response.setId(1L);
        response.setPaymentReference("TWU-PAY-ABCD1234");
        response.setBookingNumber("TWU-BKG-ABCD1234");
        response.setStatus(PaymentStatus.SUCCESS);

        when(paymentService.getPaymentByReference("TWU-PAY-ABCD1234")).thenReturn(response);

        mockMvc.perform(get("/api/v1/payments/TWU-PAY-ABCD1234"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentReference").value("TWU-PAY-ABCD1234"))
                .andExpect(jsonPath("$.status").value("SUCCESS"));
    }
}

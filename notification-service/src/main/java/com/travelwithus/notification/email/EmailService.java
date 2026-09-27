package com.travelwithus.notification.email;

public interface EmailService {

    void sendEmail(String recipientEmail, String subject, String bodyHtml);

    void sendBookingConfirmation(String recipientEmail, String recipientName, String bookingNumber, String itemTitle, String totalAmount);

    void sendPaymentReceipt(String recipientEmail, String recipientName, String paymentReference, String bookingNumber, String amount);

    void sendCancellationNotice(String recipientEmail, String recipientName, String bookingNumber, String reason);
}

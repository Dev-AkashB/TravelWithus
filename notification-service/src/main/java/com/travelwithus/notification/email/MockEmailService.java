package com.travelwithus.notification.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MockEmailService implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(MockEmailService.class);

    @Override
    public void sendEmail(String recipientEmail, String subject, String bodyHtml) {
        log.info("📧 [EMAIL SENT] To: {} | Subject: '{}' | Content Size: {} chars",
                recipientEmail, subject, bodyHtml != null ? bodyHtml.length() : 0);
    }

    @Override
    public void sendBookingConfirmation(String recipientEmail, String recipientName, String bookingNumber, String itemTitle, String totalAmount) {
        String subject = "Your TravelWithUs Booking Confirmation: " + bookingNumber;
        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #0d9488;">Pack Your Bags, %s!</h2>
                    <p>Your travel booking <strong>%s</strong> for <strong>%s</strong> is confirmed.</p>
                    <div style="background-color: #f0fdfa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Booking Reference:</strong> %s</p>
                        <p style="margin: 5px 0;"><strong>Total Paid:</strong> $%s</p>
                    </div>
                    <p style="color: #64748b; font-size: 13px;">Thank you for booking with TravelWithUs. Safe travels!</p>
                </div>
                """.formatted(recipientName != null ? recipientName : "Traveler", bookingNumber, itemTitle, bookingNumber, totalAmount);

        sendEmail(recipientEmail, subject, html);
    }

    @Override
    public void sendPaymentReceipt(String recipientEmail, String recipientName, String paymentReference, String bookingNumber, String amount) {
        String subject = "Payment Receipt: " + paymentReference + " for " + bookingNumber;
        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #10b981;">Payment Received</h2>
                    <p>Hi %s, we received your payment of <strong>$%s</strong> for booking <strong>%s</strong>.</p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Transaction Reference:</strong> %s</p>
                        <p style="margin: 5px 0;"><strong>Status:</strong> Completed</p>
                    </div>
                    <p style="color: #64748b; font-size: 13px;">TravelWithUs Payment Operations</p>
                </div>
                """.formatted(recipientName != null ? recipientName : "Customer", amount, bookingNumber, paymentReference);

        sendEmail(recipientEmail, subject, html);
    }

    @Override
    public void sendCancellationNotice(String recipientEmail, String recipientName, String bookingNumber, String reason) {
        String subject = "Booking Cancellation Notice: " + bookingNumber;
        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #ef4444;">Booking Cancelled</h2>
                    <p>Hi %s, your booking <strong>%s</strong> has been cancelled.</p>
                    <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Reason:</strong> %s</p>
                    </div>
                    <p style="color: #64748b; font-size: 13px;">If any refund is applicable, it will be credited according to policy terms.</p>
                </div>
                """.formatted(recipientName != null ? recipientName : "Traveler", bookingNumber, reason != null ? reason : "Requested by customer");

        sendEmail(recipientEmail, subject, html);
    }
}

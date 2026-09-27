package com.travelwithus.notification.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelwithus.notification.dto.NotificationDto;
import com.travelwithus.notification.dto.SendNotificationRequest;
import com.travelwithus.notification.entity.NotificationChannel;
import com.travelwithus.notification.entity.NotificationEventType;
import com.travelwithus.notification.entity.NotificationStatus;
import com.travelwithus.notification.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NotificationController.class)
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationService notificationService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void testSendNotificationEndpoint() throws Exception {
        SendNotificationRequest request = new SendNotificationRequest();
        request.setUserId(1L);
        request.setTitle("Flight Alert");
        request.setMessage("Gate changed to B12");
        request.setEventType(NotificationEventType.SYSTEM_ANNOUNCEMENT);
        request.setChannel(NotificationChannel.ALL);

        NotificationDto dto = new NotificationDto();
        dto.setId(1L);
        dto.setUserId(1L);
        dto.setTitle("Flight Alert");
        dto.setMessage("Gate changed to B12");
        dto.setStatus(NotificationStatus.DELIVERED);

        when(notificationService.sendNotification(any(SendNotificationRequest.class))).thenReturn(dto);

        mockMvc.perform(post("/api/v1/notifications/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Flight Alert"));
    }

    @Test
    void testGetUnreadCountEndpoint() throws Exception {
        when(notificationService.getUnreadCount(1L)).thenReturn(4L);

        mockMvc.perform(get("/api/v1/notifications/user/1/unread-count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unreadCount").value(4));
    }
}

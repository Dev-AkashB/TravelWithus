package com.travelwithus.user.controller;

import com.travelwithus.user.dto.ApiResponse;
import com.travelwithus.user.dto.PagedResponse;
import com.travelwithus.user.dto.UserProfileDto;
import com.travelwithus.user.dto.UserStatusUpdateRequest;
import com.travelwithus.user.exception.ForbiddenException;
import com.travelwithus.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/admin")
public class AdminUserController {

    private final UserService userService;

    @Autowired
    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    private void verifyAdminRole(String rolesHeader) {
        if (rolesHeader == null || (!rolesHeader.contains("ROLE_ADMIN") && !rolesHeader.contains("ROLE_SUPER_ADMIN"))) {
            throw new ForbiddenException("Administrator role required");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<PagedResponse<UserProfileDto>>> getAllUsers(
            @RequestHeader(value = "X-User-Roles", required = false) String roles,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        verifyAdminRole(roles);
        PagedResponse<UserProfileDto> result = userService.getAllUsers(search, page, size);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", result));
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateUserStatus(
            @RequestHeader(value = "X-User-Roles", required = false) String roles,
            @PathVariable Long userId,
            @Valid @RequestBody UserStatusUpdateRequest request) {
        verifyAdminRole(roles);
        UserProfileDto updated = userService.updateUserStatus(userId, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", updated));
    }
}

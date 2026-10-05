package com.travelwithus.gateway.filter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.travelwithus.gateway.dto.GatewayErrorResponse;
import com.travelwithus.gateway.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;

@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtUtils jwtUtils;
    private final ObjectMapper objectMapper;

    @Autowired
    public AuthenticationFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
        this.objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    }

    private static final List<String> PUBLIC_PATH_PREFIXES = List.of(
            "/api/v1/auth/",
            "/oauth2/",
            "/login/oauth2/",
            "/login/",
            "/api/v1/bookings",
            "/api/v1/payments",
            "/api/v1/destinations",
            "/api/v1/packages",
            "/api/v1/hotels",
            "/api/v1/reviews",
            "/actuator",
            "/v3/api-docs",
            "/swagger-ui",
            "/ws/"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();

        // 1. Check if the endpoint is public (allow options pre-flight as well)
        if (method == HttpMethod.OPTIONS || isPublicEndpoint(path, method)) {
            // If token is present on public endpoint, still propagate user headers if valid
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtils.validateToken(token)) {
                    ServerHttpRequest mutatedRequest = mutateWithUserHeaders(request, token);
                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                }
            }
            return chain.filter(exchange);
        }

        // 2. Secured endpoints require Bearer Authorization Header
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return onError(exchange, HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        // 3. Validate JWT
        if (!jwtUtils.validateToken(token)) {
            return onError(exchange, HttpStatus.UNAUTHORIZED, "Invalid or expired JWT token");
        }

        // 4. Role-based Access Control (RBAC)
        List<String> roles = jwtUtils.getRoles(token);

        // Admin endpoints require ROLE_ADMIN or ROLE_SUPER_ADMIN
        if (path.startsWith("/api/v1/admin/")) {
            boolean isAdmin = roles.contains("ROLE_ADMIN") || roles.contains("ROLE_SUPER_ADMIN") || roles.contains("ADMIN") || roles.contains("SUPER_ADMIN");
            if (!isAdmin) {
                return onError(exchange, HttpStatus.FORBIDDEN, "Access denied: Administrator privileges required");
            }
        }

        // 5. Mutate request to pass authenticated user claims downstream
        ServerHttpRequest mutatedRequest = mutateWithUserHeaders(request, token);
        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    private boolean isPublicEndpoint(String path, HttpMethod method) {
        for (String prefix : PUBLIC_PATH_PREFIXES) {
            if (path.startsWith(prefix)) {
                return true;
            }
        }

        // Public read-only endpoints (GET) for browsing
        if (method == HttpMethod.GET) {
            if (path.startsWith("/api/v1/destinations") ||
                path.startsWith("/api/v1/packages") ||
                path.startsWith("/api/v1/hotels") ||
                path.startsWith("/api/v1/reviews")) {
                return true;
            }
        }

        return false;
    }

    private ServerHttpRequest mutateWithUserHeaders(ServerHttpRequest request, String token) {
        String username = jwtUtils.getUsername(token);
        Long userId = jwtUtils.getUserId(token);
        List<String> roles = jwtUtils.getRoles(token);

        return request.mutate()
                .header("X-User-Email", username != null ? username : "")
                .header("X-User-Id", userId != null ? String.valueOf(userId) : "")
                .header("X-User-Roles", String.join(",", roles))
                .build();
    }

    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus status, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        GatewayErrorResponse errorResponse = GatewayErrorResponse.builder()
                .success(false)
                .message(message)
                .data(null)
                .timestamp(Instant.now())
                .build();

        byte[] bytes;
        try {
            bytes = objectMapper.writeValueAsBytes(errorResponse);
        } catch (JsonProcessingException e) {
            bytes = ("{\"success\":false,\"message\":\"" + message + "\"}").getBytes();
        }

        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -100; // Run early in filter chain
    }
}

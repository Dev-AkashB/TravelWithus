package com.travelwithus.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class LoggingFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(LoggingFilter.class);
    public static final String REQUEST_ID_HEADER = "X-Request-Id";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long startTime = System.currentTimeMillis();

        ServerHttpRequest request = exchange.getRequest();
        String requestId = request.getHeaders().getFirst(REQUEST_ID_HEADER);
        if (requestId == null || requestId.isBlank()) {
            requestId = UUID.randomUUID().toString();
        }

        // Attach request id to request headers downstream
        ServerHttpRequest mutatedRequest = request.mutate()
                .header(REQUEST_ID_HEADER, requestId)
                .build();

        final String finalRequestId = requestId;
        String path = request.getURI().getPath();
        String method = request.getMethod().name();

        log.info("[API-GATEWAY] [ReqID: {}] Incoming request {} {}", finalRequestId, method, path);

        return chain.filter(exchange.mutate().request(mutatedRequest).build())
                .then(Mono.fromRunnable(() -> {
                    long duration = System.currentTimeMillis() - startTime;
                    int statusCode = exchange.getResponse().getStatusCode() != null
                            ? exchange.getResponse().getStatusCode().value()
                            : 500;
                    String userId = exchange.getRequest().getHeaders().getFirst("X-User-Id");
                    log.info("[API-GATEWAY] [ReqID: {}] Completed {} {} with status {} in {} ms (User: {})",
                            finalRequestId, method, path, statusCode, duration, (userId != null ? userId : "ANONYMOUS"));
                }));
    }

    @Override
    public int getOrder() {
        return -200; // Run before AuthenticationFilter to assign Request-ID
    }
}

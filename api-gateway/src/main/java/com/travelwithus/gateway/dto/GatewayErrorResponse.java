package com.travelwithus.gateway.dto;

import java.time.Instant;

public class GatewayErrorResponse {
    private boolean success;
    private String message;
    private Object data;
    private Instant timestamp;

    public GatewayErrorResponse() {
    }

    public GatewayErrorResponse(boolean success, String message, Object data, Instant timestamp) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
    }

    public static Builder builder() {
        return new Builder();
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public static class Builder {
        private boolean success;
        private String message;
        private Object data;
        private Instant timestamp;

        public Builder success(boolean success) {
            this.success = success;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder data(Object data) {
            this.data = data;
            return this;
        }

        public Builder timestamp(Instant timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public GatewayErrorResponse build() {
            return new GatewayErrorResponse(success, message, data, timestamp);
        }
    }
}

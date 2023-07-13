package com.example.whiteboard.dto;

public class CanvasDTO {
    private String data;

    // Constructors, getters, and setters

    public CanvasDTO() {
    }

    public CanvasDTO(String data) {
        this.data = data;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}

package com.example.whiteboard.repository;

import com.example.whiteboard.model.Canvas;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CanvasRepository extends JpaRepository<Canvas, Long> {
    Canvas findByUserId(Long userId);
}

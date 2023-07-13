package com.example.whiteboard.service;

import com.example.whiteboard.model.Canvas;
import com.example.whiteboard.model.User;
import com.example.whiteboard.repository.CanvasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
public class CanvasService {

    private final CanvasRepository canvasRepository;

    @Autowired
    public CanvasService(CanvasRepository canvasRepository) {
        this.canvasRepository = canvasRepository;
    }

    public void saveCanvasData(Long userId, String base64Data) {
        Canvas canvas = canvasRepository.findByUserId(userId);

        if (canvas == null) {
            User user = new User();
            user.setId(userId);
            canvas = new Canvas();
            canvas.setUser(user);
        }

        byte[] imageData = Base64.getDecoder().decode(base64Data);
        canvas.setData(imageData);

        canvasRepository.save(canvas);
    }


    public String getCanvasData(Long userId) {
        Canvas canvas = canvasRepository.findByUserId(userId);

        if (canvas != null) {
            byte[] imageData = canvas.getData();
            String base64Data = Base64.getEncoder().encodeToString(imageData);
            return base64Data;
        }

        return null;
    }

}

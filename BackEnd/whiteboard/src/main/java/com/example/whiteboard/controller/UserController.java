package com.example.whiteboard.controller;

import com.example.whiteboard.dto.CanvasDTO;
import com.example.whiteboard.dto.UserDTO;
import com.example.whiteboard.model.Canvas;
import com.example.whiteboard.model.User;
import com.example.whiteboard.service.CanvasService;
import com.example.whiteboard.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.SecretKey;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Date;
import java.util.*;


@RestController
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}, allowedHeaders = "*", allowCredentials = "true")
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final CanvasService canvasService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserService userService, CanvasService canvasService) {
        this.userService = userService;
        this.canvasService = canvasService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO) {
        if (userService.isEmailRegistered(userDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
        }

        String hashedPassword = passwordEncoder.encode(userDTO.getPassword());
        User user = new User(userDTO.getFirstname(),userDTO.getLastname(), userDTO.getEmail(), hashedPassword);
        userService.registerUser(user);

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> loginUser(@RequestBody UserDTO userDTO, HttpServletRequest request) {
        User user = userService.loginUser(userDTO.getEmail(), userDTO.getPassword());
        if (user== null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }


        String token = generateToken(user.getId());


        HttpSession session = request.getSession();
        session.setAttribute("userId", user.getId());
        session.setAttribute("token", token);

        Map<String, String> responseData = new HashMap<>();
        responseData.put("token", token);
        responseData.put("name", user.getFirstname()+" "+user.getLastname());
        responseData.put("email", user.getEmail());

        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpServletRequest request) {

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/canvas")
    public ResponseEntity<String> saveCanvasData(@RequestBody CanvasDTO canvasDTO, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        Long userId = (Long) session.getAttribute("userId");

        try {
            String base64Data = canvasDTO.getData();

            canvasService.saveCanvasData(userId, base64Data);

            return ResponseEntity.ok("Canvas data saved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save the canvas data");
        }
    }


    @GetMapping("/canvas")
    public ResponseEntity<String> getCanvasData(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        long userId = (long) session.getAttribute("userId");
        String imageData=canvasService.getCanvasData(userId);

        return ResponseEntity.ok(imageData);
    }

    private String generateToken(Long userId) {

        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        long expiration = System.currentTimeMillis() + 24 * 60 * 60 * 1000;


        String token = Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setExpiration(new Date(expiration))
                .signWith(key)
                .compact();

        return token;
    }
    private String generateUniqueFileName(String originalFilename) {

        long timestamp = System.currentTimeMillis();
        return timestamp + "_" + originalFilename;
    }
}

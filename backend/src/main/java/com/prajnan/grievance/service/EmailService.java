package com.prajnan.grievance.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Modified to throw exception so Controller knows if it failed
    public void sendOtpEmail(String toEmail, String otp) throws Exception {

        // 1. ALWAYS PRINT OTP TO CONSOLE (Backup for testing)
        System.out.println("------------------------------------------------");
        System.out.println("DEBUG OTP for " + toEmail + ": " + otp);
        System.out.println("------------------------------------------------");

        // 2. Attempt to Send Email
        SimpleMailMessage message = new SimpleMailMessage();
        // Make sure this matches the username in application.properties
        message.setFrom("sangeethab312003@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Password Reset OTP - Grievance System");
        message.setText("Your OTP for password reset is: " + otp + "\n\nThis OTP is valid for 10 minutes.");

        mailSender.send(message);
        System.out.println("Mail sent successfully to " + toEmail);
    }
}
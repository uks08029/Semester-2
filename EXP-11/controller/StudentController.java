package com.example.studentapi.controller;

import com.example.studentapi.model.Student;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/student")
public class StudentController {

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to Student Management REST API";
    }

    @GetMapping("/details")
    public Student getStudent() {
        Student student =
                new Student(101,
                        "Lakshaya Kumar",
                        "B.Tech CSE AI & ML");

        return student;
    }

    @PostMapping("/add")
    public Student addStudent(@RequestBody Student student) {
        return student;
    }
}

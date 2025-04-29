package com.movie.starmovie.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/admin/comments")
// @RequiredArgsConstructor
public class CommentController {

    @GetMapping
    @Operation(summary = "Lấy tất cả bình luận")
    public String getAllComments() {
        return "Hello from CommentController!";
    }

    @PostMapping
    @Operation(summary = "Thêm phim mới")
    public String createMovie(String movieName) {
        return movieName;
    }
}

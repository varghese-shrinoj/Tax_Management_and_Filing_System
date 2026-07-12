package com.tax.taxmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.tax.taxmanagement.dto.DashboardResponse;
import com.tax.taxmanagement.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getDashboard(@RequestParam(required = false) Long userId) {

        if (userId != null) {
            return dashboardService.getDashboardForUser(userId);
        }
        return dashboardService.getDashboard();

    }
}

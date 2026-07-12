package com.tax.taxmanagement.service;

import com.tax.taxmanagement.dto.DashboardResponse;

public interface DashboardService {

    DashboardResponse getDashboard();
    DashboardResponse getDashboardForUser(Long userId);

}
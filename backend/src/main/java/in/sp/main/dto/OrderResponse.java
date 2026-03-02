package in.sp.main.dto;

import java.time.LocalDate;
import java.util.List;

public record OrderResponse(
        String orderId,
        String customerName,
        String email,
        String address,
        String mobile,
        String paymentMethod,
        String status,
        LocalDate orderDate,
        List<OrderItemResponse> items
) {}
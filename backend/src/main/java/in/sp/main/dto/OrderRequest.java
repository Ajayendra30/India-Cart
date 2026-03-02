package in.sp.main.dto;

import java.util.List;

public record OrderRequest(
        String customerName,
        String email,
        String address,
         String mobile,
         String paymentMethod,
        List<OrderItemRequest> items
) {
}

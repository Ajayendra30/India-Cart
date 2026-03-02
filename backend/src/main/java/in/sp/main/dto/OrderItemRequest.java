package in.sp.main.dto;

public record OrderItemRequest(
        int productId,
        int quantity
) {}
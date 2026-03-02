package in.sp.main.repo;


import org.springframework.data.jpa.repository.JpaRepository;

import in.sp.main.model.Order;

import java.util.Optional;

public interface OrderRepo extends JpaRepository<Order, Integer> {
    Optional<Order> findByOrderId(String orderId);
}
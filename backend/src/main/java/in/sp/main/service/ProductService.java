package in.sp.main.service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import in.sp.main.model.Product;
import in.sp.main.repo.OrderItemRepo;
import in.sp.main.repo.ProductRepo;




import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    @Autowired
    private ProductRepo productRepo;
     
    @Autowired
    private OrderItemRepo orderItemRepo;

    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    public Product getProductById(int id) {
        return productRepo.findById(id).orElse(new Product(-1));
    }

    public Product addOrUpdateProduct(Product product, MultipartFile image) throws IOException {
        product.setImageName(image.getOriginalFilename());
        product.setImageType(image.getContentType());
        product.setImageData(image.getBytes());
        return productRepo.save(product);
    }

    // 🔥🔥 THIS IS THE MAIN FIX
    @Transactional
    public void deleteProduct(int id) {
        orderItemRepo.deleteByProductId(id);   // delete child records first
        productRepo.deleteById(id);            // then delete product
    }

    public List<Product> searchProducts(String keyword) {
        return productRepo.searchProducts(keyword);
    }
}
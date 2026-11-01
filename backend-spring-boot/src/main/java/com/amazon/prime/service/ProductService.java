package com.amazon.prime.service;

import com.amazon.prime.entity.Product;
import com.amazon.prime.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public List<Product> searchCatalog(String query) {
        if (query == null || query.isBlank()) {
            return productRepository.findAll();
        }
        return productRepository.searchCatalog(query.trim());
    }

    public List<Product> filterCatalog(String category, boolean primeOnly, boolean inStockOnly, BigDecimal maxPrice, BigDecimal minRating) {
        return productRepository.filterProducts(category, primeOnly, inStockOnly, maxPrice, minRating);
    }

    @Transactional
    public Product createProduct(Product product) {
        if (product.getId() == null || product.getId().isBlank()) {
            product.setId("prod-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (product.getRating() == null) {
            product.setRating(BigDecimal.valueOf(4.5));
        }
        if (product.getReviewCount() == null) {
            product.setReviewCount(0);
        }
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(String id, Product updatedData) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

        existing.setTitle(updatedData.getTitle());
        existing.setBrand(updatedData.getBrand());
        existing.setCategory(updatedData.getCategory());
        existing.setPrice(updatedData.getPrice());
        existing.setOriginalPrice(updatedData.getOriginalPrice());
        existing.setImage(updatedData.getImage());
        existing.setIsPrime(updatedData.getIsPrime());
        existing.setIsBestSeller(updatedData.getIsBestSeller());
        existing.setInStock(updatedData.getInStock());
        existing.setStockCount(updatedData.getStockCount());
        existing.setDescription(updatedData.getDescription());

        return productRepository.save(existing);
    }

    @Transactional
    public Product restockProduct(String id, int addedUnits) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

        int newStock = existing.getStockCount() + addedUnits;
        existing.setStockCount(newStock);
        existing.setInStock(newStock > 0);

        return productRepository.save(existing);
    }

    @Transactional
    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}

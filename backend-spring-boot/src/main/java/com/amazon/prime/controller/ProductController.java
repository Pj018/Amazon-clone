package com.amazon.prime.controller;

import com.amazon.prime.entity.Product;
import com.amazon.prime.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Product Catalog API", description = "Endpoints for managing Amazon Prime retail merchandise and inventory")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products or filter catalog", description = "Retrieve products with optional query, category, prime, and price filters")
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "false") boolean primeOnly,
            @RequestParam(required = false, defaultValue = "false") boolean inStockOnly,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minRating) {

        if (query != null && !query.isBlank()) {
            return ResponseEntity.ok(productService.searchCatalog(query));
        }

        if (category != null || primeOnly || inStockOnly || maxPrice != null || minRating != null) {
            return ResponseEntity.ok(productService.filterCatalog(category, primeOnly, inStockOnly, maxPrice, minRating));
        }

        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create a new catalog product (Seller/Admin)")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product created = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing product (Seller Central)")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @Valid @RequestBody Product product) {
        try {
            Product updated = productService.updateProduct(id, product);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/restock")
    @Operation(summary = "Restock inventory units (+25, +100)")
    public ResponseEntity<Product> restockProduct(@PathVariable String id, @RequestBody Map<String, Integer> payload) {
        int units = payload.getOrDefault("units", 25);
        try {
            Product updated = productService.restockProduct(id, units);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delist product from catalog")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable String id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "Product delisted successfully", "id", id, "status", 200));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}

package com.amazon.prime.repository;

import com.amazon.prime.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findByIsPrimeTrue();

    List<Product> findByInStockTrue();

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchCatalog(@Param("query") String query);

    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR LOWER(p.category) = LOWER(:category)) AND " +
           "(:primeOnly = false OR p.isPrime = true) AND " +
           "(:inStockOnly = false OR p.inStock = true) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:minRating IS NULL OR p.rating >= :minRating)")
    List<Product> filterProducts(
            @Param("category") String category,
            @Param("primeOnly") boolean primeOnly,
            @Param("inStockOnly") boolean inStockOnly,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minRating") BigDecimal minRating);

    long countByStockCountLessThan(int threshold);
}

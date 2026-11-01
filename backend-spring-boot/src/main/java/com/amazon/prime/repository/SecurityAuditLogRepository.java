package com.amazon.prime.repository;

import com.amazon.prime.entity.SecurityAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityAuditLogRepository extends JpaRepository<SecurityAuditLog, String> {
    List<SecurityAuditLog> findTop50ByOrderByCreatedAtDesc();
}

package com.amazon.prime.repository;

import com.amazon.prime.entity.BackupSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BackupSnapshotRepository extends JpaRepository<BackupSnapshot, String> {
    List<BackupSnapshot> findAllByOrderByCreatedAtDesc();
}

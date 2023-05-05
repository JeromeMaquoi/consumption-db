package com.snail.consumptiondb.repository;

import com.snail.consumptiondb.domain.Method;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Method entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MethodRepository extends JpaRepository<Method, Long> {}

package com.snail.consumptiondb.repository;

import com.snail.consumptiondb.domain.Consumption;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Consumption entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConsumptionRepository extends JpaRepository<Consumption, Long> {}

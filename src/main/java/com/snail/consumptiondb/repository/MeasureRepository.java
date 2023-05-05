package com.snail.consumptiondb.repository;

import com.snail.consumptiondb.domain.Measure;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Measure entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MeasureRepository extends JpaRepository<Measure, Long> {}

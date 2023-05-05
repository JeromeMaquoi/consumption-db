package com.snail.consumptiondb.repository;

import com.snail.consumptiondb.domain.Software;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Software entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SoftwareRepository extends JpaRepository<Software, Long> {}

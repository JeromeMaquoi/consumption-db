package com.snail.consumptiondb.web.rest;

import com.snail.consumptiondb.domain.Consumption;
import com.snail.consumptiondb.repository.ConsumptionRepository;
import com.snail.consumptiondb.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.snail.consumptiondb.domain.Consumption}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ConsumptionResource {

    private final Logger log = LoggerFactory.getLogger(ConsumptionResource.class);

    private static final String ENTITY_NAME = "consumptionDbConsumption";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConsumptionRepository consumptionRepository;

    public ConsumptionResource(ConsumptionRepository consumptionRepository) {
        this.consumptionRepository = consumptionRepository;
    }

    /**
     * {@code POST  /consumptions} : Create a new consumption.
     *
     * @param consumption the consumption to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new consumption, or with status {@code 400 (Bad Request)} if the consumption has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/consumptions")
    public ResponseEntity<Consumption> createConsumption(@RequestBody Consumption consumption) throws URISyntaxException {
        log.debug("REST request to save Consumption : {}", consumption);
        if (consumption.getId() != null) {
            throw new BadRequestAlertException("A new consumption cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Consumption result = consumptionRepository.save(consumption);
        return ResponseEntity
            .created(new URI("/api/consumptions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /consumptions/:id} : Updates an existing consumption.
     *
     * @param id the id of the consumption to save.
     * @param consumption the consumption to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consumption,
     * or with status {@code 400 (Bad Request)} if the consumption is not valid,
     * or with status {@code 500 (Internal Server Error)} if the consumption couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/consumptions/{id}")
    public ResponseEntity<Consumption> updateConsumption(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Consumption consumption
    ) throws URISyntaxException {
        log.debug("REST request to update Consumption : {}, {}", id, consumption);
        if (consumption.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consumption.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consumptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Consumption result = consumptionRepository.save(consumption);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consumption.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /consumptions/:id} : Partial updates given fields of an existing consumption, field will ignore if it is null
     *
     * @param id the id of the consumption to save.
     * @param consumption the consumption to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consumption,
     * or with status {@code 400 (Bad Request)} if the consumption is not valid,
     * or with status {@code 404 (Not Found)} if the consumption is not found,
     * or with status {@code 500 (Internal Server Error)} if the consumption couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/consumptions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Consumption> partialUpdateConsumption(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Consumption consumption
    ) throws URISyntaxException {
        log.debug("REST request to partial update Consumption partially : {}, {}", id, consumption);
        if (consumption.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consumption.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consumptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Consumption> result = consumptionRepository
            .findById(consumption.getId())
            .map(existingConsumption -> {
                if (consumption.getValue() != null) {
                    existingConsumption.setValue(consumption.getValue());
                }
                if (consumption.getScope() != null) {
                    existingConsumption.setScope(consumption.getScope());
                }
                if (consumption.getMonitoringType() != null) {
                    existingConsumption.setMonitoringType(consumption.getMonitoringType());
                }
                if (consumption.getTimestamp() != null) {
                    existingConsumption.setTimestamp(consumption.getTimestamp());
                }

                return existingConsumption;
            })
            .map(consumptionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consumption.getId().toString())
        );
    }

    /**
     * {@code GET  /consumptions} : get all the consumptions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of consumptions in body.
     */
    @GetMapping("/consumptions")
    public List<Consumption> getAllConsumptions() {
        log.debug("REST request to get all Consumptions");
        return consumptionRepository.findAll();
    }

    /**
     * {@code GET  /consumptions/:id} : get the "id" consumption.
     *
     * @param id the id of the consumption to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the consumption, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/consumptions/{id}")
    public ResponseEntity<Consumption> getConsumption(@PathVariable Long id) {
        log.debug("REST request to get Consumption : {}", id);
        Optional<Consumption> consumption = consumptionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(consumption);
    }

    /**
     * {@code DELETE  /consumptions/:id} : delete the "id" consumption.
     *
     * @param id the id of the consumption to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/consumptions/{id}")
    public ResponseEntity<Void> deleteConsumption(@PathVariable Long id) {
        log.debug("REST request to delete Consumption : {}", id);
        consumptionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

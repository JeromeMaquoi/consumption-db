package com.snail.consumptiondb.web.rest;

import com.snail.consumptiondb.domain.Measure;
import com.snail.consumptiondb.repository.MeasureRepository;
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
 * REST controller for managing {@link com.snail.consumptiondb.domain.Measure}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MeasureResource {

    private final Logger log = LoggerFactory.getLogger(MeasureResource.class);

    private static final String ENTITY_NAME = "consumptionDbMeasure";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MeasureRepository measureRepository;

    public MeasureResource(MeasureRepository measureRepository) {
        this.measureRepository = measureRepository;
    }

    /**
     * {@code POST  /measures} : Create a new measure.
     *
     * @param measure the measure to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new measure, or with status {@code 400 (Bad Request)} if the measure has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/measures")
    public ResponseEntity<Measure> createMeasure(@RequestBody Measure measure) throws URISyntaxException {
        log.debug("REST request to save Measure : {}", measure);
        if (measure.getId() != null) {
            throw new BadRequestAlertException("A new measure cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Measure result = measureRepository.save(measure);
        return ResponseEntity
            .created(new URI("/api/measures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /measures/:id} : Updates an existing measure.
     *
     * @param id the id of the measure to save.
     * @param measure the measure to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated measure,
     * or with status {@code 400 (Bad Request)} if the measure is not valid,
     * or with status {@code 500 (Internal Server Error)} if the measure couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/measures/{id}")
    public ResponseEntity<Measure> updateMeasure(@PathVariable(value = "id", required = false) final Long id, @RequestBody Measure measure)
        throws URISyntaxException {
        log.debug("REST request to update Measure : {}, {}", id, measure);
        if (measure.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, measure.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!measureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Measure result = measureRepository.save(measure);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, measure.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /measures/:id} : Partial updates given fields of an existing measure, field will ignore if it is null
     *
     * @param id the id of the measure to save.
     * @param measure the measure to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated measure,
     * or with status {@code 400 (Bad Request)} if the measure is not valid,
     * or with status {@code 404 (Not Found)} if the measure is not found,
     * or with status {@code 500 (Internal Server Error)} if the measure couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/measures/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Measure> partialUpdateMeasure(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Measure measure
    ) throws URISyntaxException {
        log.debug("REST request to partial update Measure partially : {}, {}", id, measure);
        if (measure.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, measure.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!measureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Measure> result = measureRepository
            .findById(measure.getId())
            .map(existingMeasure -> {
                if (measure.getStartTimestamp() != null) {
                    existingMeasure.setStartTimestamp(measure.getStartTimestamp());
                }

                return existingMeasure;
            })
            .map(measureRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, measure.getId().toString())
        );
    }

    /**
     * {@code GET  /measures} : get all the measures.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of measures in body.
     */
    @GetMapping("/measures")
    public List<Measure> getAllMeasures() {
        log.debug("REST request to get all Measures");
        return measureRepository.findAll();
    }

    /**
     * {@code GET  /measures/:id} : get the "id" measure.
     *
     * @param id the id of the measure to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the measure, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/measures/{id}")
    public ResponseEntity<Measure> getMeasure(@PathVariable Long id) {
        log.debug("REST request to get Measure : {}", id);
        Optional<Measure> measure = measureRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(measure);
    }

    /**
     * {@code DELETE  /measures/:id} : delete the "id" measure.
     *
     * @param id the id of the measure to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/measures/{id}")
    public ResponseEntity<Void> deleteMeasure(@PathVariable Long id) {
        log.debug("REST request to delete Measure : {}", id);
        measureRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

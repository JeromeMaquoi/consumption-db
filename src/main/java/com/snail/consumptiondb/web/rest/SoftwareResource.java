package com.snail.consumptiondb.web.rest;

import com.snail.consumptiondb.domain.Software;
import com.snail.consumptiondb.repository.SoftwareRepository;
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
 * REST controller for managing {@link com.snail.consumptiondb.domain.Software}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SoftwareResource {

    private final Logger log = LoggerFactory.getLogger(SoftwareResource.class);

    private static final String ENTITY_NAME = "consumptionDbSoftware";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SoftwareRepository softwareRepository;

    public SoftwareResource(SoftwareRepository softwareRepository) {
        this.softwareRepository = softwareRepository;
    }

    /**
     * {@code POST  /software} : Create a new software.
     *
     * @param software the software to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new software, or with status {@code 400 (Bad Request)} if the software has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/software")
    public ResponseEntity<Software> createSoftware(@RequestBody Software software) throws URISyntaxException {
        log.debug("REST request to save Software : {}", software);
        if (software.getId() != null) {
            throw new BadRequestAlertException("A new software cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Software result = softwareRepository.save(software);
        return ResponseEntity
            .created(new URI("/api/software/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /software/:id} : Updates an existing software.
     *
     * @param id the id of the software to save.
     * @param software the software to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated software,
     * or with status {@code 400 (Bad Request)} if the software is not valid,
     * or with status {@code 500 (Internal Server Error)} if the software couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/software/{id}")
    public ResponseEntity<Software> updateSoftware(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Software software
    ) throws URISyntaxException {
        log.debug("REST request to update Software : {}, {}", id, software);
        if (software.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, software.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!softwareRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Software result = softwareRepository.save(software);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, software.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /software/:id} : Partial updates given fields of an existing software, field will ignore if it is null
     *
     * @param id the id of the software to save.
     * @param software the software to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated software,
     * or with status {@code 400 (Bad Request)} if the software is not valid,
     * or with status {@code 404 (Not Found)} if the software is not found,
     * or with status {@code 500 (Internal Server Error)} if the software couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/software/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Software> partialUpdateSoftware(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Software software
    ) throws URISyntaxException {
        log.debug("REST request to partial update Software partially : {}, {}", id, software);
        if (software.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, software.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!softwareRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Software> result = softwareRepository
            .findById(software.getId())
            .map(existingSoftware -> {
                if (software.getName() != null) {
                    existingSoftware.setName(software.getName());
                }

                return existingSoftware;
            })
            .map(softwareRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, software.getId().toString())
        );
    }

    /**
     * {@code GET  /software} : get all the software.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of software in body.
     */
    @GetMapping("/software")
    public List<Software> getAllSoftware() {
        log.debug("REST request to get all Software");
        return softwareRepository.findAll();
    }

    /**
     * {@code GET  /software/:id} : get the "id" software.
     *
     * @param id the id of the software to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the software, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/software/{id}")
    public ResponseEntity<Software> getSoftware(@PathVariable Long id) {
        log.debug("REST request to get Software : {}", id);
        Optional<Software> software = softwareRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(software);
    }

    /**
     * {@code DELETE  /software/:id} : delete the "id" software.
     *
     * @param id the id of the software to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/software/{id}")
    public ResponseEntity<Void> deleteSoftware(@PathVariable Long id) {
        log.debug("REST request to delete Software : {}", id);
        softwareRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

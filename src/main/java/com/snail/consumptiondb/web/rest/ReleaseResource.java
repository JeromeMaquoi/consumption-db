package com.snail.consumptiondb.web.rest;

import com.snail.consumptiondb.domain.Release;
import com.snail.consumptiondb.repository.ReleaseRepository;
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
 * REST controller for managing {@link com.snail.consumptiondb.domain.Release}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ReleaseResource {

    private final Logger log = LoggerFactory.getLogger(ReleaseResource.class);

    private static final String ENTITY_NAME = "consumptionDbRelease";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReleaseRepository releaseRepository;

    public ReleaseResource(ReleaseRepository releaseRepository) {
        this.releaseRepository = releaseRepository;
    }

    /**
     * {@code POST  /releases} : Create a new release.
     *
     * @param release the release to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new release, or with status {@code 400 (Bad Request)} if the release has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/releases")
    public ResponseEntity<Release> createRelease(@RequestBody Release release) throws URISyntaxException {
        log.debug("REST request to save Release : {}", release);
        if (release.getId() != null) {
            throw new BadRequestAlertException("A new release cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Release result = releaseRepository.save(release);
        return ResponseEntity
            .created(new URI("/api/releases/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /releases/:id} : Updates an existing release.
     *
     * @param id the id of the release to save.
     * @param release the release to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated release,
     * or with status {@code 400 (Bad Request)} if the release is not valid,
     * or with status {@code 500 (Internal Server Error)} if the release couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/releases/{id}")
    public ResponseEntity<Release> updateRelease(@PathVariable(value = "id", required = false) final Long id, @RequestBody Release release)
        throws URISyntaxException {
        log.debug("REST request to update Release : {}, {}", id, release);
        if (release.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, release.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!releaseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Release result = releaseRepository.save(release);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, release.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /releases/:id} : Partial updates given fields of an existing release, field will ignore if it is null
     *
     * @param id the id of the release to save.
     * @param release the release to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated release,
     * or with status {@code 400 (Bad Request)} if the release is not valid,
     * or with status {@code 404 (Not Found)} if the release is not found,
     * or with status {@code 500 (Internal Server Error)} if the release couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/releases/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Release> partialUpdateRelease(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Release release
    ) throws URISyntaxException {
        log.debug("REST request to partial update Release partially : {}, {}", id, release);
        if (release.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, release.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!releaseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Release> result = releaseRepository
            .findById(release.getId())
            .map(existingRelease -> {
                if (release.getName() != null) {
                    existingRelease.setName(release.getName());
                }
                if (release.getDate() != null) {
                    existingRelease.setDate(release.getDate());
                }
                if (release.getDescription() != null) {
                    existingRelease.setDescription(release.getDescription());
                }

                return existingRelease;
            })
            .map(releaseRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, release.getId().toString())
        );
    }

    /**
     * {@code GET  /releases} : get all the releases.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of releases in body.
     */
    @GetMapping("/releases")
    public List<Release> getAllReleases(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Releases");
        if (eagerload) {
            return releaseRepository.findAllWithEagerRelationships();
        } else {
            return releaseRepository.findAll();
        }
    }

    /**
     * {@code GET  /releases/:id} : get the "id" release.
     *
     * @param id the id of the release to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the release, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/releases/{id}")
    public ResponseEntity<Release> getRelease(@PathVariable Long id) {
        log.debug("REST request to get Release : {}", id);
        Optional<Release> release = releaseRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(release);
    }

    /**
     * {@code DELETE  /releases/:id} : delete the "id" release.
     *
     * @param id the id of the release to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/releases/{id}")
    public ResponseEntity<Void> deleteRelease(@PathVariable Long id) {
        log.debug("REST request to delete Release : {}", id);
        releaseRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

package com.snail.consumptiondb.web.rest;

import com.snail.consumptiondb.domain.Method;
import com.snail.consumptiondb.repository.MethodRepository;
import com.snail.consumptiondb.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.snail.consumptiondb.domain.Method}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MethodResource {

    private final Logger log = LoggerFactory.getLogger(MethodResource.class);

    private static final String ENTITY_NAME = "consumptionDbMethod";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MethodRepository methodRepository;

    public MethodResource(MethodRepository methodRepository) {
        this.methodRepository = methodRepository;
    }

    /**
     * {@code POST  /methods} : Create a new method.
     *
     * @param method the method to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new method, or with status {@code 400 (Bad Request)} if the method has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/methods")
    public ResponseEntity<Method> createMethod(@RequestBody Method method) throws URISyntaxException {
        log.debug("REST request to save Method : {}", method);
        if (method.getId() != null) {
            throw new BadRequestAlertException("A new method cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Method result = methodRepository.save(method);
        return ResponseEntity
            .created(new URI("/api/methods/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /methods/:id} : Updates an existing method.
     *
     * @param id the id of the method to save.
     * @param method the method to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated method,
     * or with status {@code 400 (Bad Request)} if the method is not valid,
     * or with status {@code 500 (Internal Server Error)} if the method couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/methods/{id}")
    public ResponseEntity<Method> updateMethod(@PathVariable(value = "id", required = false) final Long id, @RequestBody Method method)
        throws URISyntaxException {
        log.debug("REST request to update Method : {}, {}", id, method);
        if (method.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, method.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!methodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Method result = methodRepository.save(method);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, method.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /methods/:id} : Partial updates given fields of an existing method, field will ignore if it is null
     *
     * @param id the id of the method to save.
     * @param method the method to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated method,
     * or with status {@code 400 (Bad Request)} if the method is not valid,
     * or with status {@code 404 (Not Found)} if the method is not found,
     * or with status {@code 500 (Internal Server Error)} if the method couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/methods/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Method> partialUpdateMethod(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Method method
    ) throws URISyntaxException {
        log.debug("REST request to partial update Method partially : {}, {}", id, method);
        if (method.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, method.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!methodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Method> result = methodRepository
            .findById(method.getId())
            .map(existingMethod -> {
                if (method.getName() != null) {
                    existingMethod.setName(method.getName());
                }

                return existingMethod;
            })
            .map(methodRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, method.getId().toString())
        );
    }

    /**
     * {@code GET  /methods} : get all the methods.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of methods in body.
     */
    @GetMapping("/methods")
    public List<Method> getAllMethods(@RequestParam(required = false) String filter) {
        if ("method-is-null".equals(filter)) {
            log.debug("REST request to get all Methods where method is null");
            return StreamSupport
                .stream(methodRepository.findAll().spliterator(), false)
                .filter(method -> method.getMethod() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Methods");
        return methodRepository.findAll();
    }

    /**
     * {@code GET  /methods/:id} : get the "id" method.
     *
     * @param id the id of the method to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the method, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/methods/{id}")
    public ResponseEntity<Method> getMethod(@PathVariable Long id) {
        log.debug("REST request to get Method : {}", id);
        Optional<Method> method = methodRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(method);
    }

    /**
     * {@code DELETE  /methods/:id} : delete the "id" method.
     *
     * @param id the id of the method to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/methods/{id}")
    public ResponseEntity<Void> deleteMethod(@PathVariable Long id) {
        log.debug("REST request to delete Method : {}", id);
        methodRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

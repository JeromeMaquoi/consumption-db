package com.snail.consumptiondb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.snail.consumptiondb.IntegrationTest;
import com.snail.consumptiondb.domain.Measure;
import com.snail.consumptiondb.repository.MeasureRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MeasureResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MeasureResourceIT {

    private static final Instant DEFAULT_START_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/measures";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MeasureRepository measureRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMeasureMockMvc;

    private Measure measure;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Measure createEntity(EntityManager em) {
        Measure measure = new Measure().startTimestamp(DEFAULT_START_TIMESTAMP);
        return measure;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Measure createUpdatedEntity(EntityManager em) {
        Measure measure = new Measure().startTimestamp(UPDATED_START_TIMESTAMP);
        return measure;
    }

    @BeforeEach
    public void initTest() {
        measure = createEntity(em);
    }

    @Test
    @Transactional
    void createMeasure() throws Exception {
        int databaseSizeBeforeCreate = measureRepository.findAll().size();
        // Create the Measure
        restMeasureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(measure)))
            .andExpect(status().isCreated());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeCreate + 1);
        Measure testMeasure = measureList.get(measureList.size() - 1);
        assertThat(testMeasure.getStartTimestamp()).isEqualTo(DEFAULT_START_TIMESTAMP);
    }

    @Test
    @Transactional
    void createMeasureWithExistingId() throws Exception {
        // Create the Measure with an existing ID
        measure.setId(1L);

        int databaseSizeBeforeCreate = measureRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMeasureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(measure)))
            .andExpect(status().isBadRequest());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMeasures() throws Exception {
        // Initialize the database
        measureRepository.saveAndFlush(measure);

        // Get all the measureList
        restMeasureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(measure.getId().intValue())))
            .andExpect(jsonPath("$.[*].startTimestamp").value(hasItem(DEFAULT_START_TIMESTAMP.toString())));
    }

    @Test
    @Transactional
    void getMeasure() throws Exception {
        // Initialize the database
        measureRepository.saveAndFlush(measure);

        // Get the measure
        restMeasureMockMvc
            .perform(get(ENTITY_API_URL_ID, measure.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(measure.getId().intValue()))
            .andExpect(jsonPath("$.startTimestamp").value(DEFAULT_START_TIMESTAMP.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMeasure() throws Exception {
        // Get the measure
        restMeasureMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMeasure() throws Exception {
        // Initialize the database
        measureRepository.saveAndFlush(measure);

        int databaseSizeBeforeUpdate = measureRepository.findAll().size();

        // Update the measure
        Measure updatedMeasure = measureRepository.findById(measure.getId()).get();
        // Disconnect from session so that the updates on updatedMeasure are not directly saved in db
        em.detach(updatedMeasure);
        updatedMeasure.startTimestamp(UPDATED_START_TIMESTAMP);

        restMeasureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMeasure.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMeasure))
            )
            .andExpect(status().isOk());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeUpdate);
        Measure testMeasure = measureList.get(measureList.size() - 1);
        assertThat(testMeasure.getStartTimestamp()).isEqualTo(UPDATED_START_TIMESTAMP);
    }

    @Test
    @Transactional
    void putNonExistingMeasure() throws Exception {
        int databaseSizeBeforeUpdate = measureRepository.findAll().size();
        measure.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMeasureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, measure.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(measure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMeasure() throws Exception {
        int databaseSizeBeforeUpdate = measureRepository.findAll().size();
        measure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeasureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(measure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMeasure() throws Exception {
        int databaseSizeBeforeUpdate = measureRepository.findAll().size();
        measure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeasureMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(measure)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMeasureWithPatch() throws Exception {
        // Initialize the database
        measureRepository.saveAndFlush(measure);

        int databaseSizeBeforeUpdate = measureRepository.findAll().size();

        // Update the measure using partial update
        Measure partialUpdatedMeasure = new Measure();
        partialUpdatedMeasure.setId(measure.getId());

        restMeasureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMeasure.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMeasure))
            )
            .andExpect(status().isOk());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeUpdate);
        Measure testMeasure = measureList.get(measureList.size() - 1);
        assertThat(testMeasure.getStartTimestamp()).isEqualTo(DEFAULT_START_TIMESTAMP);
    }

    @Test
    @Transactional
    void fullUpdateMeasureWithPatch() throws Exception {
        // Initialize the database
        measureRepository.saveAndFlush(measure);

        int databaseSizeBeforeUpdate = measureRepository.findAll().size();

        // Update the measure using partial update
        Measure partialUpdatedMeasure = new Measure();
        partialUpdatedMeasure.setId(measure.getId());

        partialUpdatedMeasure.startTimestamp(UPDATED_START_TIMESTAMP);

        restMeasureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMeasure.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMeasure))
            )
            .andExpect(status().isOk());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeUpdate);
        Measure testMeasure = measureList.get(measureList.size() - 1);
        assertThat(testMeasure.getStartTimestamp()).isEqualTo(UPDATED_START_TIMESTAMP);
    }

    @Test
    @Transactional
    void patchNonExistingMeasure() throws Exception {
        int databaseSizeBeforeUpdate = measureRepository.findAll().size();
        measure.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMeasureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, measure.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(measure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMeasure() throws Exception {
        int databaseSizeBeforeUpdate = measureRepository.findAll().size();
        measure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeasureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(measure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMeasure() throws Exception {
        int databaseSizeBeforeUpdate = measureRepository.findAll().size();
        measure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMeasureMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(measure)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Measure in the database
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMeasure() throws Exception {
        // Initialize the database
        measureRepository.saveAndFlush(measure);

        int databaseSizeBeforeDelete = measureRepository.findAll().size();

        // Delete the measure
        restMeasureMockMvc
            .perform(delete(ENTITY_API_URL_ID, measure.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Measure> measureList = measureRepository.findAll();
        assertThat(measureList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

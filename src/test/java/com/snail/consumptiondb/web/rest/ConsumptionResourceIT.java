package com.snail.consumptiondb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.snail.consumptiondb.IntegrationTest;
import com.snail.consumptiondb.domain.Consumption;
import com.snail.consumptiondb.domain.enumeration.MonitoringType;
import com.snail.consumptiondb.domain.enumeration.Scope;
import com.snail.consumptiondb.repository.ConsumptionRepository;
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
 * Integration tests for the {@link ConsumptionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConsumptionResourceIT {

    private static final Long DEFAULT_VALUE = 1L;
    private static final Long UPDATED_VALUE = 2L;

    private static final Scope DEFAULT_SCOPE = Scope.APP;
    private static final Scope UPDATED_SCOPE = Scope.ALL;

    private static final MonitoringType DEFAULT_MONITORING_TYPE = MonitoringType.EVOLUTION;
    private static final MonitoringType UPDATED_MONITORING_TYPE = MonitoringType.RUNTIME;

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/consumptions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConsumptionRepository consumptionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConsumptionMockMvc;

    private Consumption consumption;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consumption createEntity(EntityManager em) {
        Consumption consumption = new Consumption()
            .value(DEFAULT_VALUE)
            .scope(DEFAULT_SCOPE)
            .monitoringType(DEFAULT_MONITORING_TYPE)
            .timestamp(DEFAULT_TIMESTAMP);
        return consumption;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consumption createUpdatedEntity(EntityManager em) {
        Consumption consumption = new Consumption()
            .value(UPDATED_VALUE)
            .scope(UPDATED_SCOPE)
            .monitoringType(UPDATED_MONITORING_TYPE)
            .timestamp(UPDATED_TIMESTAMP);
        return consumption;
    }

    @BeforeEach
    public void initTest() {
        consumption = createEntity(em);
    }

    @Test
    @Transactional
    void createConsumption() throws Exception {
        int databaseSizeBeforeCreate = consumptionRepository.findAll().size();
        // Create the Consumption
        restConsumptionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consumption)))
            .andExpect(status().isCreated());

        // Validate the Consumption in the database
        List<Consumption> consumptionList = consumptionRepository.findAll();
        assertThat(consumptionList).hasSize(databaseSizeBeforeCreate + 1);
        Consumption testConsumption = consumptionList.get(consumptionList.size() - 1);
        assertThat(testConsumption.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testConsumption.getScope()).isEqualTo(DEFAULT_SCOPE);
        assertThat(testConsumption.getMonitoringType()).isEqualTo(DEFAULT_MONITORING_TYPE);
        assertThat(testConsumption.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    @Transactional
    void createConsumptionWithExistingId() throws Exception {
        // Create the Consumption with an existing ID
        consumption.setId(1L);

        int databaseSizeBeforeCreate = consumptionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConsumptionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consumption)))
            .andExpect(status().isBadRequest());

        // Validate the Consumption in the database
        List<Consumption> consumptionList = consumptionRepository.findAll();
        assertThat(consumptionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConsumptions() throws Exception {
        // Initialize the database
        consumptionRepository.saveAndFlush(consumption);

        // Get all the consumptionList
        restConsumptionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(consumption.getId().intValue())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.intValue())))
            .andExpect(jsonPath("$.[*].scope").value(hasItem(DEFAULT_SCOPE.toString())))
            .andExpect(jsonPath("$.[*].monitoringType").value(hasItem(DEFAULT_MONITORING_TYPE.toString())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())));
    }

    @Test
    @Transactional
    void getConsumption() throws Exception {
        // Initialize the database
        consumptionRepository.saveAndFlush(consumption);

        // Get the consumption
        restConsumptionMockMvc
            .perform(get(ENTITY_API_URL_ID, consumption.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(consumption.getId().intValue()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.intValue()))
            .andExpect(jsonPath("$.scope").value(DEFAULT_SCOPE.toString()))
            .andExpect(jsonPath("$.monitoringType").value(DEFAULT_MONITORING_TYPE.toString()))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()));
    }

    @Test
    @Transactional
    void getNonExistingConsumption() throws Exception {
        // Get the consumption
        restConsumptionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingConsumption() throws Exception {
        // Initialize the database
        consumptionRepository.saveAndFlush(consumption);

        int databaseSizeBeforeUpdate = consumptionRepository.findAll().size();

        // Update the consumption
        Consumption updatedConsumption = consumptionRepository.findById(consumption.getId()).get();
        // Disconnect from session so that the updates on updatedConsumption are not directly saved in db
        em.detach(updatedConsumption);
        updatedConsumption.value(UPDATED_VALUE).scope(UPDATED_SCOPE).monitoringType(UPDATED_MONITORING_TYPE).timestamp(UPDATED_TIMESTAMP);

        restConsumptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConsumption.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConsumption))
            )
            .andExpect(status().isOk());

        // Validate the Consumption in the database
        List<Consumption> consumptionList = consumptionRepository.findAll();
        assertThat(consumptionList).hasSize(databaseSizeBeforeUpdate);
        Consumption testConsumption = consumptionList.get(consumptionList.size() - 1);
        assertThat(testConsumption.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testConsumption.getScope()).isEqualTo(UPDATED_SCOPE);
        assertThat(testConsumption.getMonitoringType()).isEqualTo(UPDATED_MONITORING_TYPE);
        assertThat(testConsumption.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void putNonExistingConsumption() throws Exception {
        int databaseSizeBeforeUpdate = consumptionRepository.findAll().size();
        consumption.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsumptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, consumption.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consumption))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consumption in the database
        List<Consumption> consumptionList = consumptionRepository.findAll();
        assertThat(consumptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConsumption() throws Exception {
        int databaseSizeBeforeUpdate = consumptionRepository.findAll().size();
        consumption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsumptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consumption))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consumption in the database
        List<Consumption> consumptionList = consumptionRepository.findAll();
        assertThat(consumptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConsumption() throws Exception {
        int databaseSizeBeforeUpdate = consumptionRepository.findAll().size();
        consumption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsumptionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consumption)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consumption in the database
        List<Consumption> consumptionList = consumptionRepository.findAll();
        assertThat(consumptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConsumptionWithPatch() throws Exception {
        // Initialize the database
        consumptionRepository.saveAndFlush(consumption);

        int databaseSizeBeforeUpdate = consumptionRepository.findAll().size();

        // Update the consumption using partial update
        Consumption partialUpdatedConsumption = new Consumption();
        partialUpdatedConsumption.setId(consumption.getId());

        partialUpdatedConsumption.value(UPDATED_VALUE).scope(UPDATED_SCOPE).monitoringType(UPDATED_MONITORING_TYPE);

        restConsumptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsumption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsumption))
            )
            .andExpect(status().isOk());

        // Validate the Consumption in the database
        List<Consumption> consumptionList = consumptionRepository.findAll();
        assertThat(consumptionList).hasSize(databaseSizeBeforeUpdate);
        Consumption testConsumption = consumptionList.get(consumptionList.size() - 1);
        assertThat(testConsumption.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testConsumption.getScope()).isEqualTo(UPDATED_SCOPE);
        assertThat(testConsumption.getMonitoringType()).isEqualTo(UPDATED_MONITORING_TYPE);
        assertThat(testConsumption.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    @Transactional
    void fullUpdateConsumptionWithPatch() throws Exception {
        // Initialize the database
        consumptionRepository.saveAndFlush(consumption);

        int databaseSizeBeforeUpdate = consumptionRepository.findAll().size();

        // Update the consumption using partial update
        Consumption partialUpdatedConsumption = new Consumption();
        partialUpdatedConsumption.setId(consumption.getId());

        partialUpdatedConsumption
            .value(UPDATED_VALUE)
            .scope(UPDATED_SCOPE)
            .monitoringType(UPDATED_MONITORING_TYPE)
            .timestamp(UPDATED_TIMESTAMP);

        restConsumptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsumption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsumption))
            )
            .andExpect(status().isOk());

        // Validate the Consumption in the database
        List<Consumption> consumptionList = consumptionRepository.findAll();
        assertThat(consumptionList).hasSize(databaseSizeBeforeUpdate);
        Consumption testConsumption = consumptionList.get(consumptionList.size() - 1);
        assertThat(testConsumption.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testConsumption.getScope()).isEqualTo(UPDATED_SCOPE);
        assertThat(testConsumption.getMonitoringType()).isEqualTo(UPDATED_MONITORING_TYPE);
        assertThat(testConsumption.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void patchNonExistingConsumption() throws Exception {
        int databaseSizeBeforeUpdate = consumptionRepository.findAll().size();
        consumption.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsumptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, consumption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consumption))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consumption in the database
        List<Consumption> consumptionList = consumptionRepository.findAll();
        assertThat(consumptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConsumption() throws Exception {
        int databaseSizeBeforeUpdate = consumptionRepository.findAll().size();
        consumption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsumptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consumption))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consumption in the database
        List<Consumption> consumptionList = consumptionRepository.findAll();
        assertThat(consumptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConsumption() throws Exception {
        int databaseSizeBeforeUpdate = consumptionRepository.findAll().size();
        consumption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsumptionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(consumption))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consumption in the database
        List<Consumption> consumptionList = consumptionRepository.findAll();
        assertThat(consumptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConsumption() throws Exception {
        // Initialize the database
        consumptionRepository.saveAndFlush(consumption);

        int databaseSizeBeforeDelete = consumptionRepository.findAll().size();

        // Delete the consumption
        restConsumptionMockMvc
            .perform(delete(ENTITY_API_URL_ID, consumption.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Consumption> consumptionList = consumptionRepository.findAll();
        assertThat(consumptionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

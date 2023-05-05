package com.snail.consumptiondb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.snail.consumptiondb.IntegrationTest;
import com.snail.consumptiondb.domain.Method;
import com.snail.consumptiondb.repository.MethodRepository;
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
 * Integration tests for the {@link MethodResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MethodResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/methods";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MethodRepository methodRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMethodMockMvc;

    private Method method;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Method createEntity(EntityManager em) {
        Method method = new Method().name(DEFAULT_NAME);
        return method;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Method createUpdatedEntity(EntityManager em) {
        Method method = new Method().name(UPDATED_NAME);
        return method;
    }

    @BeforeEach
    public void initTest() {
        method = createEntity(em);
    }

    @Test
    @Transactional
    void createMethod() throws Exception {
        int databaseSizeBeforeCreate = methodRepository.findAll().size();
        // Create the Method
        restMethodMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(method)))
            .andExpect(status().isCreated());

        // Validate the Method in the database
        List<Method> methodList = methodRepository.findAll();
        assertThat(methodList).hasSize(databaseSizeBeforeCreate + 1);
        Method testMethod = methodList.get(methodList.size() - 1);
        assertThat(testMethod.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createMethodWithExistingId() throws Exception {
        // Create the Method with an existing ID
        method.setId(1L);

        int databaseSizeBeforeCreate = methodRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMethodMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(method)))
            .andExpect(status().isBadRequest());

        // Validate the Method in the database
        List<Method> methodList = methodRepository.findAll();
        assertThat(methodList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMethods() throws Exception {
        // Initialize the database
        methodRepository.saveAndFlush(method);

        // Get all the methodList
        restMethodMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(method.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getMethod() throws Exception {
        // Initialize the database
        methodRepository.saveAndFlush(method);

        // Get the method
        restMethodMockMvc
            .perform(get(ENTITY_API_URL_ID, method.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(method.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingMethod() throws Exception {
        // Get the method
        restMethodMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMethod() throws Exception {
        // Initialize the database
        methodRepository.saveAndFlush(method);

        int databaseSizeBeforeUpdate = methodRepository.findAll().size();

        // Update the method
        Method updatedMethod = methodRepository.findById(method.getId()).get();
        // Disconnect from session so that the updates on updatedMethod are not directly saved in db
        em.detach(updatedMethod);
        updatedMethod.name(UPDATED_NAME);

        restMethodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMethod.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMethod))
            )
            .andExpect(status().isOk());

        // Validate the Method in the database
        List<Method> methodList = methodRepository.findAll();
        assertThat(methodList).hasSize(databaseSizeBeforeUpdate);
        Method testMethod = methodList.get(methodList.size() - 1);
        assertThat(testMethod.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingMethod() throws Exception {
        int databaseSizeBeforeUpdate = methodRepository.findAll().size();
        method.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMethodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, method.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(method))
            )
            .andExpect(status().isBadRequest());

        // Validate the Method in the database
        List<Method> methodList = methodRepository.findAll();
        assertThat(methodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMethod() throws Exception {
        int databaseSizeBeforeUpdate = methodRepository.findAll().size();
        method.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMethodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(method))
            )
            .andExpect(status().isBadRequest());

        // Validate the Method in the database
        List<Method> methodList = methodRepository.findAll();
        assertThat(methodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMethod() throws Exception {
        int databaseSizeBeforeUpdate = methodRepository.findAll().size();
        method.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMethodMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(method)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Method in the database
        List<Method> methodList = methodRepository.findAll();
        assertThat(methodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMethodWithPatch() throws Exception {
        // Initialize the database
        methodRepository.saveAndFlush(method);

        int databaseSizeBeforeUpdate = methodRepository.findAll().size();

        // Update the method using partial update
        Method partialUpdatedMethod = new Method();
        partialUpdatedMethod.setId(method.getId());

        partialUpdatedMethod.name(UPDATED_NAME);

        restMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMethod.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMethod))
            )
            .andExpect(status().isOk());

        // Validate the Method in the database
        List<Method> methodList = methodRepository.findAll();
        assertThat(methodList).hasSize(databaseSizeBeforeUpdate);
        Method testMethod = methodList.get(methodList.size() - 1);
        assertThat(testMethod.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateMethodWithPatch() throws Exception {
        // Initialize the database
        methodRepository.saveAndFlush(method);

        int databaseSizeBeforeUpdate = methodRepository.findAll().size();

        // Update the method using partial update
        Method partialUpdatedMethod = new Method();
        partialUpdatedMethod.setId(method.getId());

        partialUpdatedMethod.name(UPDATED_NAME);

        restMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMethod.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMethod))
            )
            .andExpect(status().isOk());

        // Validate the Method in the database
        List<Method> methodList = methodRepository.findAll();
        assertThat(methodList).hasSize(databaseSizeBeforeUpdate);
        Method testMethod = methodList.get(methodList.size() - 1);
        assertThat(testMethod.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingMethod() throws Exception {
        int databaseSizeBeforeUpdate = methodRepository.findAll().size();
        method.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, method.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(method))
            )
            .andExpect(status().isBadRequest());

        // Validate the Method in the database
        List<Method> methodList = methodRepository.findAll();
        assertThat(methodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMethod() throws Exception {
        int databaseSizeBeforeUpdate = methodRepository.findAll().size();
        method.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(method))
            )
            .andExpect(status().isBadRequest());

        // Validate the Method in the database
        List<Method> methodList = methodRepository.findAll();
        assertThat(methodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMethod() throws Exception {
        int databaseSizeBeforeUpdate = methodRepository.findAll().size();
        method.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMethodMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(method)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Method in the database
        List<Method> methodList = methodRepository.findAll();
        assertThat(methodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMethod() throws Exception {
        // Initialize the database
        methodRepository.saveAndFlush(method);

        int databaseSizeBeforeDelete = methodRepository.findAll().size();

        // Delete the method
        restMethodMockMvc
            .perform(delete(ENTITY_API_URL_ID, method.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Method> methodList = methodRepository.findAll();
        assertThat(methodList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

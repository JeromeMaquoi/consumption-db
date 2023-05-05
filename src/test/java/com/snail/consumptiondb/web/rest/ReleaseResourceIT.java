package com.snail.consumptiondb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.snail.consumptiondb.IntegrationTest;
import com.snail.consumptiondb.domain.Release;
import com.snail.consumptiondb.repository.ReleaseRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ReleaseResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ReleaseResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/releases";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ReleaseRepository releaseRepository;

    @Mock
    private ReleaseRepository releaseRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReleaseMockMvc;

    private Release release;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Release createEntity(EntityManager em) {
        Release release = new Release().name(DEFAULT_NAME).date(DEFAULT_DATE).description(DEFAULT_DESCRIPTION);
        return release;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Release createUpdatedEntity(EntityManager em) {
        Release release = new Release().name(UPDATED_NAME).date(UPDATED_DATE).description(UPDATED_DESCRIPTION);
        return release;
    }

    @BeforeEach
    public void initTest() {
        release = createEntity(em);
    }

    @Test
    @Transactional
    void createRelease() throws Exception {
        int databaseSizeBeforeCreate = releaseRepository.findAll().size();
        // Create the Release
        restReleaseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(release)))
            .andExpect(status().isCreated());

        // Validate the Release in the database
        List<Release> releaseList = releaseRepository.findAll();
        assertThat(releaseList).hasSize(databaseSizeBeforeCreate + 1);
        Release testRelease = releaseList.get(releaseList.size() - 1);
        assertThat(testRelease.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testRelease.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testRelease.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createReleaseWithExistingId() throws Exception {
        // Create the Release with an existing ID
        release.setId(1L);

        int databaseSizeBeforeCreate = releaseRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReleaseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(release)))
            .andExpect(status().isBadRequest());

        // Validate the Release in the database
        List<Release> releaseList = releaseRepository.findAll();
        assertThat(releaseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllReleases() throws Exception {
        // Initialize the database
        releaseRepository.saveAndFlush(release);

        // Get all the releaseList
        restReleaseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(release.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllReleasesWithEagerRelationshipsIsEnabled() throws Exception {
        when(releaseRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restReleaseMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(releaseRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllReleasesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(releaseRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restReleaseMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(releaseRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getRelease() throws Exception {
        // Initialize the database
        releaseRepository.saveAndFlush(release);

        // Get the release
        restReleaseMockMvc
            .perform(get(ENTITY_API_URL_ID, release.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(release.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingRelease() throws Exception {
        // Get the release
        restReleaseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRelease() throws Exception {
        // Initialize the database
        releaseRepository.saveAndFlush(release);

        int databaseSizeBeforeUpdate = releaseRepository.findAll().size();

        // Update the release
        Release updatedRelease = releaseRepository.findById(release.getId()).get();
        // Disconnect from session so that the updates on updatedRelease are not directly saved in db
        em.detach(updatedRelease);
        updatedRelease.name(UPDATED_NAME).date(UPDATED_DATE).description(UPDATED_DESCRIPTION);

        restReleaseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRelease.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRelease))
            )
            .andExpect(status().isOk());

        // Validate the Release in the database
        List<Release> releaseList = releaseRepository.findAll();
        assertThat(releaseList).hasSize(databaseSizeBeforeUpdate);
        Release testRelease = releaseList.get(releaseList.size() - 1);
        assertThat(testRelease.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRelease.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testRelease.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingRelease() throws Exception {
        int databaseSizeBeforeUpdate = releaseRepository.findAll().size();
        release.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReleaseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, release.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(release))
            )
            .andExpect(status().isBadRequest());

        // Validate the Release in the database
        List<Release> releaseList = releaseRepository.findAll();
        assertThat(releaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRelease() throws Exception {
        int databaseSizeBeforeUpdate = releaseRepository.findAll().size();
        release.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReleaseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(release))
            )
            .andExpect(status().isBadRequest());

        // Validate the Release in the database
        List<Release> releaseList = releaseRepository.findAll();
        assertThat(releaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRelease() throws Exception {
        int databaseSizeBeforeUpdate = releaseRepository.findAll().size();
        release.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReleaseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(release)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Release in the database
        List<Release> releaseList = releaseRepository.findAll();
        assertThat(releaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReleaseWithPatch() throws Exception {
        // Initialize the database
        releaseRepository.saveAndFlush(release);

        int databaseSizeBeforeUpdate = releaseRepository.findAll().size();

        // Update the release using partial update
        Release partialUpdatedRelease = new Release();
        partialUpdatedRelease.setId(release.getId());

        partialUpdatedRelease.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restReleaseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRelease.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRelease))
            )
            .andExpect(status().isOk());

        // Validate the Release in the database
        List<Release> releaseList = releaseRepository.findAll();
        assertThat(releaseList).hasSize(databaseSizeBeforeUpdate);
        Release testRelease = releaseList.get(releaseList.size() - 1);
        assertThat(testRelease.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRelease.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testRelease.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateReleaseWithPatch() throws Exception {
        // Initialize the database
        releaseRepository.saveAndFlush(release);

        int databaseSizeBeforeUpdate = releaseRepository.findAll().size();

        // Update the release using partial update
        Release partialUpdatedRelease = new Release();
        partialUpdatedRelease.setId(release.getId());

        partialUpdatedRelease.name(UPDATED_NAME).date(UPDATED_DATE).description(UPDATED_DESCRIPTION);

        restReleaseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRelease.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRelease))
            )
            .andExpect(status().isOk());

        // Validate the Release in the database
        List<Release> releaseList = releaseRepository.findAll();
        assertThat(releaseList).hasSize(databaseSizeBeforeUpdate);
        Release testRelease = releaseList.get(releaseList.size() - 1);
        assertThat(testRelease.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRelease.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testRelease.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingRelease() throws Exception {
        int databaseSizeBeforeUpdate = releaseRepository.findAll().size();
        release.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReleaseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, release.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(release))
            )
            .andExpect(status().isBadRequest());

        // Validate the Release in the database
        List<Release> releaseList = releaseRepository.findAll();
        assertThat(releaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRelease() throws Exception {
        int databaseSizeBeforeUpdate = releaseRepository.findAll().size();
        release.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReleaseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(release))
            )
            .andExpect(status().isBadRequest());

        // Validate the Release in the database
        List<Release> releaseList = releaseRepository.findAll();
        assertThat(releaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRelease() throws Exception {
        int databaseSizeBeforeUpdate = releaseRepository.findAll().size();
        release.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReleaseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(release)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Release in the database
        List<Release> releaseList = releaseRepository.findAll();
        assertThat(releaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRelease() throws Exception {
        // Initialize the database
        releaseRepository.saveAndFlush(release);

        int databaseSizeBeforeDelete = releaseRepository.findAll().size();

        // Delete the release
        restReleaseMockMvc
            .perform(delete(ENTITY_API_URL_ID, release.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Release> releaseList = releaseRepository.findAll();
        assertThat(releaseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

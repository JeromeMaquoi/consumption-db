package com.snail.consumptiondb.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.snail.consumptiondb.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReleaseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Release.class);
        Release release1 = new Release();
        release1.setId(1L);
        Release release2 = new Release();
        release2.setId(release1.getId());
        assertThat(release1).isEqualTo(release2);
        release2.setId(2L);
        assertThat(release1).isNotEqualTo(release2);
        release1.setId(null);
        assertThat(release1).isNotEqualTo(release2);
    }
}

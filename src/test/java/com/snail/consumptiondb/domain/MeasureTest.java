package com.snail.consumptiondb.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.snail.consumptiondb.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MeasureTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Measure.class);
        Measure measure1 = new Measure();
        measure1.setId(1L);
        Measure measure2 = new Measure();
        measure2.setId(measure1.getId());
        assertThat(measure1).isEqualTo(measure2);
        measure2.setId(2L);
        assertThat(measure1).isNotEqualTo(measure2);
        measure1.setId(null);
        assertThat(measure1).isNotEqualTo(measure2);
    }
}

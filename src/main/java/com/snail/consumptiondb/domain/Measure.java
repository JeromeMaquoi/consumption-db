package com.snail.consumptiondb.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Measure.
 */
@Entity
@Table(name = "measure")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Measure implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "start_timestamp")
    private Instant startTimestamp;

    @ManyToOne
    @JsonIgnoreProperties(value = { "methods", "measures" }, allowSetters = true)
    private Consumption consumption;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Measure id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartTimestamp() {
        return this.startTimestamp;
    }

    public Measure startTimestamp(Instant startTimestamp) {
        this.setStartTimestamp(startTimestamp);
        return this;
    }

    public void setStartTimestamp(Instant startTimestamp) {
        this.startTimestamp = startTimestamp;
    }

    public Consumption getConsumption() {
        return this.consumption;
    }

    public void setConsumption(Consumption consumption) {
        this.consumption = consumption;
    }

    public Measure consumption(Consumption consumption) {
        this.setConsumption(consumption);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Measure)) {
            return false;
        }
        return id != null && id.equals(((Measure) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Measure{" +
            "id=" + getId() +
            ", startTimestamp='" + getStartTimestamp() + "'" +
            "}";
    }
}

package com.snail.consumptiondb.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.snail.consumptiondb.domain.enumeration.MonitoringType;
import com.snail.consumptiondb.domain.enumeration.Scope;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Consumption.
 */
@Entity
@Table(name = "consumption")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Consumption implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "value")
    private Long value;

    @Enumerated(EnumType.STRING)
    @Column(name = "scope")
    private Scope scope;

    @Enumerated(EnumType.STRING)
    @Column(name = "monitoring_type")
    private MonitoringType monitoringType;

    @Column(name = "timestamp")
    private Instant timestamp;

    @OneToMany(mappedBy = "consumption")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "method", "method", "consumption", "releases" }, allowSetters = true)
    private Set<Method> methods = new HashSet<>();

    @OneToMany(mappedBy = "consumption")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "consumption" }, allowSetters = true)
    private Set<Measure> measures = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Consumption id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getValue() {
        return this.value;
    }

    public Consumption value(Long value) {
        this.setValue(value);
        return this;
    }

    public void setValue(Long value) {
        this.value = value;
    }

    public Scope getScope() {
        return this.scope;
    }

    public Consumption scope(Scope scope) {
        this.setScope(scope);
        return this;
    }

    public void setScope(Scope scope) {
        this.scope = scope;
    }

    public MonitoringType getMonitoringType() {
        return this.monitoringType;
    }

    public Consumption monitoringType(MonitoringType monitoringType) {
        this.setMonitoringType(monitoringType);
        return this;
    }

    public void setMonitoringType(MonitoringType monitoringType) {
        this.monitoringType = monitoringType;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public Consumption timestamp(Instant timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Set<Method> getMethods() {
        return this.methods;
    }

    public void setMethods(Set<Method> methods) {
        if (this.methods != null) {
            this.methods.forEach(i -> i.setConsumption(null));
        }
        if (methods != null) {
            methods.forEach(i -> i.setConsumption(this));
        }
        this.methods = methods;
    }

    public Consumption methods(Set<Method> methods) {
        this.setMethods(methods);
        return this;
    }

    public Consumption addMethod(Method method) {
        this.methods.add(method);
        method.setConsumption(this);
        return this;
    }

    public Consumption removeMethod(Method method) {
        this.methods.remove(method);
        method.setConsumption(null);
        return this;
    }

    public Set<Measure> getMeasures() {
        return this.measures;
    }

    public void setMeasures(Set<Measure> measures) {
        if (this.measures != null) {
            this.measures.forEach(i -> i.setConsumption(null));
        }
        if (measures != null) {
            measures.forEach(i -> i.setConsumption(this));
        }
        this.measures = measures;
    }

    public Consumption measures(Set<Measure> measures) {
        this.setMeasures(measures);
        return this;
    }

    public Consumption addMeasure(Measure measure) {
        this.measures.add(measure);
        measure.setConsumption(this);
        return this;
    }

    public Consumption removeMeasure(Measure measure) {
        this.measures.remove(measure);
        measure.setConsumption(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Consumption)) {
            return false;
        }
        return id != null && id.equals(((Consumption) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Consumption{" +
            "id=" + getId() +
            ", value=" + getValue() +
            ", scope='" + getScope() + "'" +
            ", monitoringType='" + getMonitoringType() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            "}";
    }
}

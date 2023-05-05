package com.snail.consumptiondb.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Method.
 */
@Entity
@Table(name = "method")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Method implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @JoinColumn(unique = true)
    @JsonIgnoreProperties(value = { "method", "method", "consumption", "releases" }, allowSetters = true)
    @OneToOne
    private Method method;

    @ManyToOne
    @JsonIgnoreProperties(value = { "methods", "measures" }, allowSetters = true)
    private Consumption consumption;

    @ManyToMany(mappedBy = "methods")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "software", "methods" }, allowSetters = true)
    private Set<Release> releases = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Method id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Method name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Method getMethod() {
        return this.method;
    }

    public void setMethod(Method method) {
        if (this.method != null) {
            this.method.setMethod(null);
        }
        if (method != null) {
            method.setMethod(this);
        }
        this.method = method;
    }

    public Method method(Method method) {
        this.setMethod(method);
        return this;
    }

    public Consumption getConsumption() {
        return this.consumption;
    }

    public void setConsumption(Consumption consumption) {
        this.consumption = consumption;
    }

    public Method consumption(Consumption consumption) {
        this.setConsumption(consumption);
        return this;
    }

    public Set<Release> getReleases() {
        return this.releases;
    }

    public void setReleases(Set<Release> releases) {
        if (this.releases != null) {
            this.releases.forEach(i -> i.removeMethod(this));
        }
        if (releases != null) {
            releases.forEach(i -> i.addMethod(this));
        }
        this.releases = releases;
    }

    public Method releases(Set<Release> releases) {
        this.setReleases(releases);
        return this;
    }

    public Method addRelease(Release release) {
        this.releases.add(release);
        release.getMethods().add(this);
        return this;
    }

    public Method removeRelease(Release release) {
        this.releases.remove(release);
        release.getMethods().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Method)) {
            return false;
        }
        return id != null && id.equals(((Method) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Method{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}

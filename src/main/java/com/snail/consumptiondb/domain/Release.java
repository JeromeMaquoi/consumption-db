package com.snail.consumptiondb.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Release.
 */
@Entity
@Table(name = "jhi_release")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Release implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "date")
    private Instant date;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "release")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "release" }, allowSetters = true)
    private Set<Software> software = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_jhi_release__method",
        joinColumns = @JoinColumn(name = "jhi_release_id"),
        inverseJoinColumns = @JoinColumn(name = "method_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "method", "method", "consumption", "releases" }, allowSetters = true)
    private Set<Method> methods = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Release id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Release name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getDate() {
        return this.date;
    }

    public Release date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public String getDescription() {
        return this.description;
    }

    public Release description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Software> getSoftware() {
        return this.software;
    }

    public void setSoftware(Set<Software> software) {
        if (this.software != null) {
            this.software.forEach(i -> i.setRelease(null));
        }
        if (software != null) {
            software.forEach(i -> i.setRelease(this));
        }
        this.software = software;
    }

    public Release software(Set<Software> software) {
        this.setSoftware(software);
        return this;
    }

    public Release addSoftware(Software software) {
        this.software.add(software);
        software.setRelease(this);
        return this;
    }

    public Release removeSoftware(Software software) {
        this.software.remove(software);
        software.setRelease(null);
        return this;
    }

    public Set<Method> getMethods() {
        return this.methods;
    }

    public void setMethods(Set<Method> methods) {
        this.methods = methods;
    }

    public Release methods(Set<Method> methods) {
        this.setMethods(methods);
        return this;
    }

    public Release addMethod(Method method) {
        this.methods.add(method);
        method.getReleases().add(this);
        return this;
    }

    public Release removeMethod(Method method) {
        this.methods.remove(method);
        method.getReleases().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Release)) {
            return false;
        }
        return id != null && id.equals(((Release) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Release{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", date='" + getDate() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}

package com.snail.consumptiondb.repository;

import com.snail.consumptiondb.domain.Release;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ReleaseRepositoryWithBagRelationshipsImpl implements ReleaseRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Release> fetchBagRelationships(Optional<Release> release) {
        return release.map(this::fetchMethods);
    }

    @Override
    public Page<Release> fetchBagRelationships(Page<Release> releases) {
        return new PageImpl<>(fetchBagRelationships(releases.getContent()), releases.getPageable(), releases.getTotalElements());
    }

    @Override
    public List<Release> fetchBagRelationships(List<Release> releases) {
        return Optional.of(releases).map(this::fetchMethods).orElse(Collections.emptyList());
    }

    Release fetchMethods(Release result) {
        return entityManager
            .createQuery("select release from Release release left join fetch release.methods where release is :release", Release.class)
            .setParameter("release", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Release> fetchMethods(List<Release> releases) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, releases.size()).forEach(index -> order.put(releases.get(index).getId(), index));
        List<Release> result = entityManager
            .createQuery(
                "select distinct release from Release release left join fetch release.methods where release in :releases",
                Release.class
            )
            .setParameter("releases", releases)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}

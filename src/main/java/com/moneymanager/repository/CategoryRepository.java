package com.moneymanager.repository;

import com.moneymanager.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Buscar categorías por el tag
    List<Category> findByTag(String tag);

    // Buscar categorías por el ID del usuario
    List<Category> findByUser_Id(Long idUser);
}

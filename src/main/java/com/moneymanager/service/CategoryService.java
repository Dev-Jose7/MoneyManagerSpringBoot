package com.moneymanager.service;

import com.moneymanager.model.Category;
import com.moneymanager.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Crear una nueva categoría
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    // Consultar categorías por usuario
    public List<Category> findCategoriesByUserId(Long userId) {
        return categoryRepository.findByUser_Id(userId);
    }

    // Consultar categorías por tag
    public List<Category> findCategoriesByTag(String tag) {
        return categoryRepository.findByTag(tag);
    }

    // Actualizar una categoría existente
    public Category updateCategory(Long id, Category updatedCategory) {
        Optional<Category> existingCategoryOpt = categoryRepository.findById(id);
        if (existingCategoryOpt.isPresent()) {
            Category existingCategory = existingCategoryOpt.get();
            existingCategory.setTag(updatedCategory.getTag());
            return categoryRepository.save(existingCategory);
        }
        return null;
    }

    // Eliminar una categoría
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}

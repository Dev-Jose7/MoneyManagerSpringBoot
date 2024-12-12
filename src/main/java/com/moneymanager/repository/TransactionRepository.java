package com.moneymanager.repository;

import com.moneymanager.model.Transaction;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Buscar transacciones por el ID del usuario con categorías y usuarios
    @EntityGraph(attributePaths = {"category", "category.tag"})
    List<Transaction> findByUser_Id(Long idUser);

    // Buscar transacciones por el ID de la categoría
    List<Transaction> findByCategory_Id(Long idCategory);

    // Buscar transacciones por tipo (Ingreso o Gasto)
    List<Transaction> findByType(String type);

    List<Transaction> findByUser_IdAndValueBetween(Long userId, Double minValue, Double maxValue);

    List<Transaction> findByUser_IdAndDateBetween(Long userId, java.time.LocalDate startDate, java.time.LocalDate endDate);

    @Query("SELECT SUM(t.value) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type")
    Double sumTransactionsByTypeAndUserId(@Param("userId") Long userId, @Param("type") String type);

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND YEAR(t.date) = :year")
    List<Transaction> findByUserIdAndYear(@Param("userId") Long userId, @Param("year") int year);
}

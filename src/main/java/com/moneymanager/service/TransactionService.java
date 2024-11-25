package com.moneymanager.service;

import com.moneymanager.model.Category;
import com.moneymanager.model.Transaction;
import com.moneymanager.repository.CategoryRepository;
import com.moneymanager.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    // Crear una nueva transacción
    @Transactional
    public Transaction createTransaction(Transaction transaction) {
        // Buscar la categoría desde la base de datos
        Category category = categoryRepository.findById(transaction.getCategory().getId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        // Asignar la categoría cargada completamente a la transacción
        transaction.setCategory(category);

        // Guardar la transacción
        return transactionRepository.save(transaction);
    }

    // Consultar transacciones por usuario con categorías y usuarios
    public List<Transaction> findTransactionsByUserId(Long userId) {
        return transactionRepository.findByUser_Id(userId);
    }

    // Consultar transacciones por categoría
    public List<Transaction> findTransactionsByCategoryId(Long categoryId) {
        return transactionRepository.findByCategory_Id(categoryId);
    }

    // Consultar transacciones por tipo (Ingreso o Gasto)
    public List<Transaction> findTransactionsByType(String type) {
        return transactionRepository.findByType(type);
    }

    // Consultar transacciones por fecha
    public List<Transaction> findTransactionsByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByUser_IdAndDateBetween(userId, startDate, endDate);
    }

    // Consultar transacciones por valor (rango)
    public List<Transaction> findTransactionsByValueRange(Long userId, Double minValue, Double maxValue) {
        return transactionRepository.findByUser_IdAndValueBetween(userId, minValue, maxValue);
    }

    // Actualizar una transacción existente
    public Transaction updateTransaction(Long id, Transaction updatedTransaction) {
        Optional<Transaction> existingTransactionOpt = transactionRepository.findById(id);
        if (existingTransactionOpt.isPresent()) {
            Transaction existingTransaction = existingTransactionOpt.get();
            existingTransaction.setType(updatedTransaction.getType());
            existingTransaction.setValue(updatedTransaction.getValue());
            existingTransaction.setCategory(updatedTransaction.getCategory());
            existingTransaction.setDate(updatedTransaction.getDate());
            existingTransaction.setDescription(updatedTransaction.getDescription());
            return transactionRepository.save(existingTransaction);
        }
        return null;
    }

    // Eliminar una transacción
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    // Calcular el balance de un usuario (ingresos - gastos)
    public Double calculateBalance(Long userId) {
        Double totalIncome = transactionRepository.sumTransactionsByTypeAndUserId(userId, "Ingreso");
        Double totalExpense = transactionRepository.sumTransactionsByTypeAndUserId(userId, "Gasto");
        return totalIncome - totalExpense;
    }
}

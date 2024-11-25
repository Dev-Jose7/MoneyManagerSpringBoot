package com.moneymanager.controller;

import com.moneymanager.model.Category;
import com.moneymanager.model.Transaction;
import com.moneymanager.service.CategoryService;
import com.moneymanager.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private CategoryService categoryService;

    // Crear una nueva transacción
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@Valid @RequestBody Transaction transaction) {
        if (transaction.getValue() <= 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Transaction createdTransaction = transactionService.createTransaction(transaction);
        return new ResponseEntity<>(createdTransaction, HttpStatus.CREATED);
    }

    // Obtener transacciones por usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionsByUserId(@PathVariable Long userId) {
        List<Transaction> transactions = transactionService.findTransactionsByUserId(userId);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    // Obtener transacciones por tipo (Ingreso/Gasto)
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Transaction>> getTransactionsByType(@PathVariable String type) {
        List<Transaction> transactions = transactionService.findTransactionsByType(type);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    // Obtener transacciones por categoría
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Transaction>> getTransactionsByCategoryId(@PathVariable Long categoryId) {
        List<Transaction> transactions = transactionService.findTransactionsByCategoryId(categoryId);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    // Obtener transacciones por fecha
    @GetMapping("/date-range")
    public ResponseEntity<List<Transaction>> getTransactionsByDateRange(
            @RequestParam Long userId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<Transaction> transactions = transactionService.findTransactionsByDateRange(userId, startDate, endDate);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    // Obtener transacciones por rango de valor
    @GetMapping("/value-range")
    public ResponseEntity<List<Transaction>> getTransactionsByValueRange(
            @RequestParam Long userId,
            @RequestParam Double minValue,
            @RequestParam Double maxValue) {
        List<Transaction> transactions = transactionService.findTransactionsByValueRange(userId, minValue, maxValue);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    // Actualizar una transacción
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id, @Valid @RequestBody Transaction updatedTransaction) {
        if (updatedTransaction.getValue() <= 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Usar el servicio para encontrar la categoría
        Category category = categoryService.findById(updatedTransaction.getCategory().getId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
        updatedTransaction.setCategory(category);

        Transaction transaction = transactionService.updateTransaction(id, updatedTransaction);
        if (transaction != null) {
            return new ResponseEntity<>(transaction, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    // Eliminar una transacción
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Obtener el balance de un usuario
    @GetMapping("/balance/{userId}")
    public ResponseEntity<Double> getBalance(@PathVariable Long userId) {
        Double balance = transactionService.calculateBalance(userId);
        return new ResponseEntity<>(balance, HttpStatus.OK);
    }
}

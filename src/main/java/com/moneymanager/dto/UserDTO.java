package com.moneymanager.dto;

import com.moneymanager.model.Category;
import com.moneymanager.model.Transaction;

import java.util.List;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private List<Transaction> transactions;
    private List<Category> categories;

    public UserDTO(Long id, String name, String email, List<Transaction> transactions, List<Category> categories) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.transactions = transactions;
        this.categories = categories;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", transactions=" + transactions +
                ", categories=" + categories +
                '}';
    }
}

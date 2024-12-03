package com.moneymanager.service;

import com.moneymanager.dto.UserDTO;
import com.moneymanager.model.Category;
import com.moneymanager.model.Transaction;
import com.moneymanager.model.User;
import com.moneymanager.repository.CategoryRepository;
import com.moneymanager.repository.TransactionRepository;
import com.moneymanager.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    // Método para registrar un nuevo usuario
    @Transactional
    public User registerUser(User user) {
        User savedUser = userRepository.save(user); // Asegúrate de guardar primero el usuario
        createDefaultCategories(savedUser);        // Luego crea las categorías relacionadas
        return savedUser;
    }

    private void createDefaultCategories(User user) {
        List<Category> defaultCategories = List.of(
                new Category(user, "Salario"),
                new Category(user, "Arriendo"),
                new Category(user, "Comisión"),
                new Category(user, "Servicios"),
                new Category(user, "Transporte"),
                new Category(user, "Alimentación"),
                new Category(user, "Entretenimiento"),
                new Category(user, "Compras"),
                new Category(user, "Varios")
        );
        categoryRepository.saveAll(defaultCategories); // Guarda las categorías después de asignar el usuario
    }

    // Autenticación básica del usuario
    public User authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return userOpt.get();
        }
        return null;
    }

    // Obtener los detalles completos del usuario con categorías y transacciones
    @Transactional
    public UserDTO getUserDetails(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        List<Transaction> transactions = transactionRepository.findByUser_Id(userId);
        List<Category> categories = categoryRepository.findByUser_Id(userId);

        return new UserDTO(user.getId(), user.getName(), user.getEmail(), transactions, categories);
    }

    // Buscar usuario por email
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Buscar usuario por ID
    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    // Actualizar todos los datos del usuario
    public User updateUser(Long id, User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            existingUser.setName(updatedUser.getName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPassword(updatedUser.getPassword());
            return userRepository.save(existingUser);
        }
        return null;
    }

    // Actualiza solo el nombre del usuario
    public User updateUserName(Long id, String name) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setName(name);
            return userRepository.save(user);
        }
        return null;
    }

    // Actualiza solo el correo del usuario
    public User updateUserEmail(Long id, String email) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setEmail(email);
            return userRepository.save(user);
        }
        return null;
    }

    // Actualiza solo la contraseña
    public User updateUserPassword(Long id, String password) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(password);
            return userRepository.save(user);
        }
        return null;
    }

    // Eliminar usuario por ID
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}

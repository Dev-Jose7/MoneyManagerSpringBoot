package com.moneymanager.repository;

import com.moneymanager.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Buscar un usuario por su correo electrónico (único)
    Optional<User> findByEmail(String email);

    // Buscar un usuario por su nombre (si se requiere alguna búsqueda personalizada)
    Optional<User> findByName(String name);

    // Buscar usuario con categorías y transacciones
    @EntityGraph(attributePaths = {"categories", "transactions"})
    Optional<User> findById(Long id);
}

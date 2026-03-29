package com.miturno.appointment_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name= "clients")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String secondLastName;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private int age;

    @Enumerated(EnumType.STRING)
    private Type type;

    @Column(nullable = false)
    private boolean active;

    enum Type { STANDARD, PREMIUM }

}
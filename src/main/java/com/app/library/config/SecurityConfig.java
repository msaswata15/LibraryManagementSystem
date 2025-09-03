
package com.app.library.config;
import org.springframework.http.HttpMethod;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.app.library.filter.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired @Lazy
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**", "/api/auth/**", "/actuator/health", "/health").permitAll()
                // Allow GET for books to both USER and LIBRARIAN
                .requestMatchers(HttpMethod.GET, "/api/books", "/api/books/**").permitAll()
                // Only LIBRARIAN can add, update, or delete books
                .requestMatchers(HttpMethod.POST, "/api/books").hasRole("LIBRARIAN")
                .requestMatchers(HttpMethod.PUT, "/api/books/**").hasRole("LIBRARIAN")
                .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasRole("LIBRARIAN")
                // Also allow /books endpoints for LIBRARIAN (for legacy/frontend compatibility)
                .requestMatchers(HttpMethod.GET, "/books", "/books/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/books").hasRole("LIBRARIAN")
                .requestMatchers(HttpMethod.PUT, "/books/**").hasRole("LIBRARIAN")
                .requestMatchers(HttpMethod.DELETE, "/books/**").hasRole("LIBRARIAN")
                // Book requests: Users can create, Librarians can manage
                .requestMatchers(HttpMethod.POST, "/api/request-book").hasRole("USER")
                .requestMatchers(HttpMethod.GET, "/api/request-book").hasAnyRole("USER", "LIBRARIAN")
                .requestMatchers(HttpMethod.PUT, "/api/request-book/**").hasRole("LIBRARIAN")
                // Only librarians can manage members, borrow; allow both roles to return
                .requestMatchers("/api/borrow", "/api/members/**").hasRole("LIBRARIAN")
                .requestMatchers("/api/return/**").hasAnyRole("USER", "LIBRARIAN")
                // Allow borrowings endpoints
                .requestMatchers(HttpMethod.POST, "/borrowings").hasRole("LIBRARIAN")
                .requestMatchers(HttpMethod.GET, "/borrowings").hasAnyRole("USER", "LIBRARIAN")
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req,res,e) -> {
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"error\":\"UNAUTHORIZED: " + e.getMessage() + "\"}");
                })
                .accessDeniedHandler((req,res,e) -> {
                    res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"error\":\"FORBIDDEN: " + e.getMessage() + "\"}");
                })
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}

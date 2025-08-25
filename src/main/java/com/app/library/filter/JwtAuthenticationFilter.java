package com.app.library.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;

import com.app.library.service.CustomUserDetailsService;
import com.app.library.util.JwtUtil;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getServletPath();
        log.info("[JWT] Processing path: {}", path);
        if (path.startsWith("/auth/") || path.startsWith("/api/auth/")) {
            log.info("[JWT] Skipping filter for auth endpoint");
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            log.info("[JWT] Raw token: {}", jwt);
            try {
                username = jwtUtil.extractUsername(jwt);
                log.info("[JWT] Extracted username: {}", username);
            } catch (Exception e) {
                log.error("[JWT] Failed to extract username from token: {}", e.getMessage());
            }
        } else {
            log.warn("[JWT] No Authorization header or does not start with Bearer");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.info("[JWT] Authenticated user: {}", username);
                } else {
                    log.warn("[JWT] Token validation failed for user: {}", username);
                }
            } catch (Exception e) {
                log.error("[JWT] Exception during authentication: {}", e.getMessage(), e);
            }
        } else if (username == null) {
            log.warn("[JWT] Username is null after parsing token");
        } else if (SecurityContextHolder.getContext().getAuthentication() != null) {
            log.info("[JWT] SecurityContext already has authentication");
        }
        filterChain.doFilter(request, response);
    }
}

package com.travelwithus.auth.security;

import com.travelwithus.auth.entity.Role;
import com.travelwithus.auth.entity.User;
import com.travelwithus.auth.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.oauth2.authorizedRedirectUri:http://localhost:3000/oauth2/redirect}")
    private String redirectUri;

    @Autowired
    public OAuth2AuthenticationSuccessHandler(JwtTokenProvider tokenProvider,
                                            UserRepository userRepository,
                                            @Lazy PasswordEncoder passwordEncoder) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String givenName = oAuth2User.getAttribute("given_name");
        String familyName = oAuth2User.getAttribute("family_name");
        String picture = oAuth2User.getAttribute("picture");

        if (email == null || email.isBlank()) {
            email = oAuth2User.getName() + "@google.travelwithus.com";
        }

        final String finalEmail = email.toLowerCase().trim();
        Optional<User> existingUser = userRepository.findByEmail(finalEmail);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            log.info("OAuth2 login for existing user: {}", finalEmail);
        } else {
            log.info("Creating new user from OAuth2 provider: {}", finalEmail);
            user = new User();
            user.setEmail(finalEmail);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setFirstName(givenName != null ? givenName : (name != null ? name.split(" ")[0] : "Google"));
            user.setLastName(familyName != null ? familyName : (name != null && name.contains(" ") ? name.substring(name.indexOf(" ") + 1) : "User"));
            user.setEnabled(true);
            user.setRoles(Set.of(Role.ROLE_USER));
            user = userRepository.save(user);
        }

        List<String> roleNames = user.getRoles().stream().map(Role::name).collect(Collectors.toList());
        String token = tokenProvider.generateTokenFromUser(user.getId(), user.getEmail(), roleNames);

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .queryParam("userId", user.getId())
                .queryParam("email", URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8))
                .queryParam("name", URLEncoder.encode(user.getFirstName() + " " + user.getLastName(), StandardCharsets.UTF_8))
                .queryParam("avatarUrl", picture != null ? URLEncoder.encode(picture, StandardCharsets.UTF_8) : "")
                .queryParam("provider", "GOOGLE")
                .build().toUriString();

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}

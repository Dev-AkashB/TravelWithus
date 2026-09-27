FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
COPY src/main/resources/config-repo config-repo
EXPOSE 8888
ENTRYPOINT ["java", "-jar", "app.jar"]

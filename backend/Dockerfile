# Use Java 17 for building
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy pom and source code
COPY pom.xml .
COPY src ./src

# Install maven and build
RUN apk add --no-cache maven \
    && mvn clean package -DskipTests

# Use Java 17 runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the jar from build stage
COPY --from=build /app/target/bmw-mod-tracker-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
RUN apk add --no-cache maven
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -q
RUN ls -la target/

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/bmw-mod-tracker-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Write application-prod.properties at container startup from env vars
# This avoids committing secrets to git
CMD ["sh", "-c", "\
  mkdir -p /app/config && \
  echo \"spring.datasource.url=jdbc:postgresql://db.oocbzxeiyyftkvnugyts.supabase.co:5432/postgres?sslmode=require\" > /app/config/application-prod.properties && \
  echo \"spring.datasource.username=postgres\" >> /app/config/application-prod.properties && \
  echo \"spring.datasource.password=${DB_PASSWORD}\" >> /app/config/application-prod.properties && \
  echo \"spring.jpa.hibernate.ddl-auto=update\" >> /app/config/application-prod.properties && \
  echo \"spring.jpa.show-sql=false\" >> /app/config/application-prod.properties && \
  echo \"spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect\" >> /app/config/application-prod.properties && \
  echo \"jwt.secret=${JWT_SECRET}\" >> /app/config/application-prod.properties && \
  echo \"jwt.expiration-ms=86400000\" >> /app/config/application-prod.properties && \
  echo \"server.port=${PORT:-8080}\" >> /app/config/application-prod.properties && \
  java -Dspring.profiles.active=prod \
       -Dspring.config.additional-location=file:/app/config/ \
       -Dserver.port=${PORT:-8080} \
       -jar app.jar"]

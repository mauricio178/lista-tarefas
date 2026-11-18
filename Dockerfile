# ---------- Etapa 1: build do front React ----------
FROM node:22-alpine AS front
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# O vite.config.js manda o resultado para ../src/main/resources/static
RUN npm run build

# ---------- Etapa 2: build da API Spring Boot ----------
FROM maven:3.9-eclipse-temurin-21 AS back
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
COPY --from=front /app/src/main/resources/static ./src/main/resources/static
RUN mvn -q package -DskipTests

# ---------- Etapa 3: imagem final, só com o Java ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=back /app/target/app.jar app.jar
EXPOSE 8080
# Limita o uso de memória para caber nos 512 MB do plano gratuito
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=70", "-jar", "app.jar"]

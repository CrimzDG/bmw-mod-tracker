#!/bin/sh
exec java \
  -Dspring.profiles.active=prod \
  -Dserver.port=${PORT:-8080} \
  -jar app.jar

#!/bin/bash


kubectl port-forward service/keycloak 8080:8080 -n my-blog &
kubectl port-forward service/frontend 3000:3000 -n my-blog &
kubectl port-forward service/backend 8000:8000 -n my-blog &
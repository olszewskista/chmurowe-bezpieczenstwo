#!/bin/bash

kubectl delete -f ./kubernetes/backend-deployment.yaml
kubectl delete -f ./kubernetes/frontend-deployment.yaml
kubectl delete -f ./kubernetes/keycloak-deployment.yaml
kubectl delete -f ./kubernetes/postgres-deployment.yaml
kubectl delete -f ./kubernetes/mongo-deployment.yaml
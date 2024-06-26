#!/bin/bash

kubectl delete -f ./kubernetes/backend-deployment.yaml -n my-blog
kubectl delete -f ./kubernetes/frontend-deployment.yaml -n my-blog
kubectl delete -f ./kubernetes/keycloak-deployment.yaml -n my-blog
kubectl delete -f ./kubernetes/postgres-deployment.yaml -n my-blog
kubectl delete -f ./kubernetes/mongo-deployment.yaml -n my-blog
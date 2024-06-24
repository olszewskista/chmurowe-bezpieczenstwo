#!/bin/zsh

kubectl create namespace my-blog


kubectl create configmap keycloak-realm-config --from-file=realm.json=./keycloak/realm.json -n my-blog

# kubectl delete -f ./kubernetes/mongo-deployment.yaml -n my-blog
# kubectl delete -f ./kubernetes/postgres-deployment.yaml -n my-blog
# kubectl delete -f ./kubernetes/keycloak-deployment.yaml -n my-blog
# kubectl delete -f ./kubernetes/backend-deployment.yaml -n my-blog
# kubectl delete -f ./kubernetes/frontend-deployment.yaml -n my-blog


kubectl apply -f ./kubernetes/mongo-deployment.yaml -n my-blog
kubectl apply -f ./kubernetes/postgres-deployment.yaml -n my-blog
kubectl apply -f ./kubernetes/keycloak-deployment.yaml -n my-blog
kubectl apply -f ./kubernetes/backend-deployment.yaml -n my-blog
kubectl apply -f ./kubernetes/frontend-deployment.yaml -n my-blog


sleep 1

# If there are non-running pods, print them and exit with status 1
check_pods() {
    pods=$(kubectl get pods --all-namespaces --no-headers)
    non_running_pods=$(echo "$pods" | awk '{if ($4 != "Running" && $4 != "Completed" && $4 != "Succeeded") print $0}')
}

# Loop until all pods are running or completed
while true; do
    check_pods

    if [ -z "$non_running_pods" ]; then
        echo "All pods are running, completed, or succeeded."
        break
    else
        echo "The following pods are not running, completed, or succeeded:"
        echo "$non_running_pods"
        echo "Checking again in 10 seconds..."
        sleep 10
    fi
done

kubectl port-forward service/keycloak 8080:8080 &
kubectl port-forward service/frontend 3000:3000 &
# kubectl port-forward service/backend 5000:5000 &
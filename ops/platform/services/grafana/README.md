# Grafana
Observability and telemetry

## Internal URL
[http://grafana.grafana.svc.cluster.local](http://grafana.grafana.svc.cluster.local)

## Credentials
| Field    | Value                                                                                                           |
|----------|-----------------------------------------------------------------------------------------------------------------|
| Username | `kubectl get secret --namespace grafana grafana-admin-credentials -o jsonpath="{.data.admin-user}" \| base64 --decode ; echo`     |
| Password | `kubectl get secret --namespace grafana grafana-admin-credentials -o jsonpath="{.data.admin-password}" \| base64 --decode ; echo` |

## Local Access
```bash
export POD_NAME=$(kubectl get pods \
  --namespace grafana \
  -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=grafana" \
  -o jsonpath="{.items[0].metadata.name}")

kubectl --namespace grafana port-forward $POD_NAME 3000

open http://localhost:3000/
```

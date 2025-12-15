# MinIO
S3-compatible object/blob storage

## Internal URL
[http://minio.minio.svc.cluster.local](http://minio.minio.svc.cluster.local)

## Credentials
| Field    | Value                                                                                                            |
|----------|------------------------------------------------------------------------------------------------------------------|
| Username | `kubectl get secret --namespace minio minio-admin-credentials -o jsonpath="{.data.admin-user}" \| base64 -d`     |
| Password | `kubectl get secret --namespace minio minio-admin-credentials -o jsonpath="{.data.admin-password}" \| base64 -d` |

## Local Access
```bash
export ROOT_USER=$(kubectl get secret --namespace minio minio-admin-credentials -o jsonpath="{.data.admin-user}" | base64 -d)
export ROOT_PASSWORD=$(kubectl get secret --namespace minio minio-admin-credentials -o jsonpath="{.data.admin-password}" | base64 -d)

kubectl port-forward --namespace minio svc/minio-console 9090:9090

open http://localhost:9090/
```

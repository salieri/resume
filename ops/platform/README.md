# Platform

Platform controls what is deployed to the Kubernetes cluster.

To manage cloud infrastructure (e.g., creating the Kubernetes cluster), see the [infrastructure](../infra/README.md) directory.

## Platform Services
Platform services are installed using `helmfile`.

## Self-Managed
1. `brew install helmfile`
2. `helmfile --environment <env> -f ./envs/<env>/helmfile.yaml apply`




k3s

Oracle Cloud
Rackspace Spot
Hetzner




## Secrets
Faust uses [External Secrets Operator](https://external-secrets.io/) to manage secrets in the Kubernetes cluster.

By default, External Secrets Operator is configured to use 1Password as the secret store.
You can change this by modifying the `secrets.yaml` file in this directory.

## You'll Need
1. A 1Password Account
    1. [Create a new 1Password Vault](https://my.1password.com/vaults) for your environment
    2. Warning: All passwords stored in this vault are accessible in the Kubernetes cluster
    3. [Create a 1Password Service Account for Kubernetes](https://my.1password.com/developer-tools/infrastructure-secrets)
       1. Grant read/write access to the vault you created earlier
2. A Kubernetes Cluster and its `kubeconfig` file

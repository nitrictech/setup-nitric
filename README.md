# Nitric Actions

Nitric's GitHub Setup exposes the Nitric CLI to your GitHub workflow so that you can run any command you wish using actions.

> Note: Action runner must be set to linux, as MacOS runner does not include docker and Windows VMs are limited in depth.

```yaml
  runs-on: ubuntu-latest
```

## Build 

To update your changes, rebuild the dist folder with the following command - 

```bash
npm run build 
```

## Inputs

```yaml
  version: 
    description: Version of the CLI being used
    required: false
    default: 1.2.1   
```

## Example workflow

name: Sample configuratin to deploy to AWS
on:
  workflow_dispatch:
  push:
    branches:
      - main
env:
  PULUMI_CONFIG_PASSPHRASE: ${{ secrets.PULUMI_ACCESS_TOKEN }}          
  PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}
jobs:
  update:
    name: Deploy
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-region: ${{ secrets.AWS_REGION }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}         
      - name: Install Nitric CLI
        uses: nitrictech/setup-nitric@v1
        with: 
          version: 1.2.1
      - name: Install dependencies
        uses: pulumi/setup-pulumi@v2               
      - name: Checkout project 
        uses: actions/checkout@v3
      - name: Resolve packages
        run: npm install
      - name: Deploy stack to aws
        run: nitric up -s dev -v0
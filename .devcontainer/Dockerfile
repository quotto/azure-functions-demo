ARG VARIANT=16
FROM mcr.microsoft.com/azure-functions/node:4-node16-core-tools

ENV PATH="./node_modules/.bin:${PATH}"

# devcontainerの設定で/workspaces/azure-functions-demo/app/node_modulesを匿名ボリューム指定した際に
# ownerがrootの755で作成されてしまうためあらかじめownerをnodeとしてディレクトリを作成しておく
RUN mkdir -p /workspaces/azure-functions-demo/app/node_modules
RUN chown -R node:node /workspaces/azure-functions-demo/app/node_modules
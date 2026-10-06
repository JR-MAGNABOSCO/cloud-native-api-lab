# ADR 001 - Migração do Ingress-NGINX para Kubernetes Gateway API

## Status

Aceito

## Contexto

O laboratório Cloud Native API foi inicialmente configurado utilizando
Kubernetes Ingress com o controlador Ingress-NGINX.

A arquitetura implementada utiliza o Ingress-NGINX como ponto de entrada HTTP
para encaminhar requisições para as APIs:

- `/api/users` → `users-service`
- `/api/orders` → `orders-service`

Durante os estudos relacionados a APIs, Web Services, Kubernetes e arquitetura
Cloud Native, foi identificada a descontinuação oficial do projeto
Ingress-NGINX.

O projeto foi aposentado em março de 2026. Instalações existentes continuam
funcionando, porém deixam de receber novas versões, correções de bugs e
atualizações para futuras vulnerabilidades de segurança.

Como este laboratório está sendo desenvolvido em 2026 e posteriormente será
utilizado como base para uma arquitetura na Microsoft Azure, não é desejável
adotar como solução definitiva um controlador que já encerrou seu ciclo de
manutenção.

## Decisão

Migrar a camada de entrada HTTP do laboratório de Kubernetes Ingress com
Ingress-NGINX para Kubernetes Gateway API.

A migração será realizada de forma controlada, mantendo temporariamente o
Ingress-NGINX funcionando enquanto a nova arquitetura é implementada e
validada.

A nova arquitetura deverá utilizar:

- GatewayClass
- Gateway
- HTTPRoute
- um Gateway Controller compatível com Gateway API

Os recursos existentes de aplicação serão preservados:

- Deployments
- Pods
- Services
- ConfigMaps
- Secrets
- Liveness Probes
- Readiness Probes
- PostgreSQL

## Arquitetura anterior

Cliente
  |
  v
Ingress-NGINX Controller
  |
  v
Ingress
  |
  +-- /api/users  --> users-service
  |
  +-- /api/orders --> orders-service
                         |
                         v
                        Pods

## Nova arquitetura

Cliente
  |
  v
Gateway
  |
  v
HTTPRoute
  |
  +-- /api/users  --> users-service
  |
  +-- /api/orders --> orders-service
                         |
                         v
                        Pods

## Estratégia de migração

1. Manter o Ingress-NGINX atual funcionando.
2. Instalar os CRDs da Kubernetes Gateway API.
3. Instalar um Gateway Controller compatível.
4. Criar o GatewayClass/Gateway necessários.
5. Criar HTTPRoutes para Users API e Orders API.
6. Validar o acesso às duas APIs pela nova camada de entrada.
7. Validar o CRUD end-to-end.
8. Remover o recurso Ingress antigo.
9. Desabilitar e remover o Ingress-NGINX do laboratório.

## Consequências

### Positivas

- Uso de uma API de roteamento mais moderna.
- Adoção de tecnologia com desenvolvimento e suporte ativos.
- Menor dependência de configurações específicas do Ingress-NGINX.
- Arquitetura mais adequada para evolução futura do laboratório.
- Experiência prática de migração entre tecnologias de infraestrutura.

### Pontos de atenção

- Gateway API define recursos e contratos, mas ainda necessita de uma
  implementação de Gateway Controller.
- Os manifests de Ingress não são diretamente equivalentes aos recursos
  Gateway/HTTPRoute.
- A nova camada deve ser completamente validada antes da remoção do
  Ingress-NGINX existente.

## Motivação educacional

A mudança também faz parte do objetivo educacional deste laboratório.

O Ingress-NGINX foi inicialmente utilizado para compreender conceitos como
roteamento HTTP, Services e exposição de aplicações Kubernetes.

Durante a evolução do projeto, foi identificada uma mudança real no ciclo de
vida da tecnologia utilizada.

A migração para Gateway API permite exercitar um aspecto importante de DevOps:
avaliar continuamente suporte, segurança, manutenção e evolução dos componentes
que fazem parte de uma arquitetura.

## Implementação

A decisão foi implementada em 06/10/2026.

Para o ambiente local baseado em Minikube foi adotado o Envoy Gateway como
implementação da Kubernetes Gateway API.

Foram criados os seguintes recursos:

- `GatewayClass`: `envoy-gateway`
- `Gateway`: `api-gateway`
- `HTTPRoute`: `api-route`

O `HTTPRoute` passou a realizar o roteamento:

- `/api/users` → `users-service`
- `/api/orders` → `orders-service`

Durante a migração, o Ingress-NGINX permaneceu ativo para permitir a validação
da nova arquitetura sem interromper o ambiente existente.

Após a configuração do Gateway API, foram validadas operações de leitura e
escrita através da nova camada de entrada, incluindo:

- GET
- POST
- PUT
- DELETE

Também foi validado o acesso das APIs ao PostgreSQL através dos workloads
existentes.

Após a validação completa, o recurso Ingress antigo foi removido e o addon
Ingress-NGINX do Minikube foi desabilitado.

As APIs continuaram respondendo normalmente através do Envoy Gateway após a
remoção do controlador anterior.

## Resultado

A migração foi concluída com sucesso.

A arquitetura local deixou de depender do Ingress-NGINX e passou a utilizar
Kubernetes Gateway API com Envoy Gateway.

A mudança não exigiu alterações no código das APIs, Deployments, Services,
ConfigMaps, Secrets, probes ou banco de dados. A alteração ficou restrita à
camada responsável pela entrada e roteamento HTTP.

O processo também demonstrou a importância de acompanhar o ciclo de vida das
tecnologias utilizadas em uma arquitetura. A decisão de migração surgiu durante
os estudos realizados durante o desenvolvimento do laboratório, após a
identificação da aposentadoria oficial do Ingress-NGINX.

## Arquitetura resultante

Cliente
  |
  v
Envoy Proxy
  |
  v
Gateway API
  |
  +-- GatewayClass: envoy-gateway
  |
  +-- Gateway: api-gateway
  |
  +-- HTTPRoute: api-route
          |
          +-- /api/users  --> users-service  --> Users Pods
          |
          +-- /api/orders --> orders-service --> Orders Pods
                                      |
                                      v
                                  PostgreSQL

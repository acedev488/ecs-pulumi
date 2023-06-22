import * as aws from "@pulumi/aws";

export const cluster = new aws.ecs.Cluster("app-cluster", {
    name: "ecs-case-study-cluster",
    settings: [{ name: "containerInsights", value: "enabled" }],
});

new aws.ecs.ClusterCapacityProviders("app-cluster-capacity", {
    clusterName: cluster.name,
    capacityProviders: ["FARGATE", "FARGATE_SPOT"],
    defaultCapacityProviderStrategies: [
        { capacityProvider: "FARGATE", weight: 1, base: 1 },
        { capacityProvider: "FARGATE_SPOT", weight: 4 },
    ],
});

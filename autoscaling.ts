import * as aws from "@pulumi/aws";
import { cluster } from "./cluster";
import { service } from "./service";
import * as pulumi from "@pulumi/pulumi";

const resourceId = pulumi.interpolate`service/${cluster.name}/${service.name}`;

export const scalableTarget = new aws.appautoscaling.Target("app-scalable-target", {
    serviceNamespace: "ecs",
    scalableDimension: "ecs:service:DesiredCount",
    resourceId,
    minCapacity: 2,
    maxCapacity: 8,
});

new aws.appautoscaling.Policy("app-scale-up-cpu", {
    policyType: "TargetTrackingScaling",
    serviceNamespace: "ecs",
    scalableDimension: "ecs:service:DesiredCount",
    resourceId,
    targetTrackingScalingPolicyConfiguration: {
        predefinedMetricSpecification: {
            predefinedMetricType: "ECSServiceAverageCPUUtilization",
        },
        targetValue: 60,
        scaleInCooldown: 120,
        scaleOutCooldown: 60,
    },
}, { dependsOn: [scalableTarget] });

new aws.appautoscaling.Policy("app-scale-up-mem", {
    policyType: "TargetTrackingScaling",
    serviceNamespace: "ecs",
    scalableDimension: "ecs:service:DesiredCount",
    resourceId,
    targetTrackingScalingPolicyConfiguration: {
        predefinedMetricSpecification: {
            predefinedMetricType: "ECSServiceAverageMemoryUtilization",
        },
        targetValue: 70,
        scaleInCooldown: 120,
        scaleOutCooldown: 60,
    },
}, { dependsOn: [scalableTarget] });

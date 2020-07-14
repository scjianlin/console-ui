/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

export default {
  WORKLOADS_DESC:
    'The workload is usually the actual carrier for accessing the service, and is also the actual running carrier for system applications such as node log collection and monitoring. Workload is an abstract model for a group of Pods.',
  DEPLOYMENT_DESC:
    'Deployment provides fine-grained management of common applications in KubeSphere. Deployment configuration describes the desired state of specific components of an application as Pod templates.',
  DEPLOYMENT_CREATE_DESC:
    "A Deployment controller provides declarative updates for Pods and ReplicaSets, it's used to replace the ReplicationController to get Application management easier. Typically, using Deployment to create pods and ReplicateSet, rolling upgrade and rolling back applications, scaling out or in applications, stopping or resuming applications.",
  STATEFULSET_DESC:
    'StatefulSet is used to manage stateful applications, manages the deployment and scaling of a set of Pods, and provides guarantees about the ordering and uniqueness of these Pods.',
  STATEFULSET_CREATE_DESC:
    'StatefulSet is used to manage stateful applications, manages the deployment and scaling of a set of Pods, and provides guarantees about the ordering and uniqueness of these Pods.',
  DAEMONSET_DESC:
    'A DaemonSet ensures that all (or some) Nodes run a copy of a Pod. Typically, a DaemonSet is used to running a logs collection, monitoring daemon or other system management applications.',
  DAEMONSET_CREATE_DESC:
    'A DaemonSet ensures that all (or some) Nodes run a copy of a Pod. Typically, a DaemonSet is used to running a logs collection, monitoring daemon or other system management applications.',
  JOB_DESC:
    'A Job is used to execute one-time task. A job creates one or more pods and ensures that a specified number of them successfully terminate.',
  JOB_CREATE_DESC:
    'A Job is used to execute one-time task. A job creates one or more pods and ensures that a specified number of them successfully terminate.',
  CRONJOB_DESC:
    'A CronJob creates Jobs on a time-based schedule. For example, it runs a job periodically on a given schedule or only runs a job once on a given time.',
  CRONJOB_CREATE_DESC:
    'A CronJob creates Jobs on a time-based schedule. For example, it runs a job periodically on a given schedule or only runs a job once on a given time.',

  CRONJOB_NAME_DESC:
    'It can only contain lowercase letters, numbers and hyphens("-"), and must begin with a lowercase letter, ending with a number or lowercase letter. The maximum length of characters is set to 52.',
  CRONJOB_NAME_TOO_LONG: 'The maximum length of characters is set to 52.',

  REPLICAS_SCALE_NOTIFY_TITLE: 'Does it take effect immediately?',
  REPLICAS_SCALE_NOTIFY_CONTENT:
    'You are going to change the replicas of your workload to {num}. You can continue to change the number of replicas, or you can make the change take effect immediately.',
  REPLICAS_SCALE_NOTIFY_CONFIRM: 'Apply changes ({seconds}s)',
  REPLICAS_SCALE_NOTIFY_CANCEL: 'Discard changes',

  POD_SETTING_TIP: 'The number of Pods when update',
  MIN_AVAILABLE_POD_LABEL: 'The minimum available number of Pods',
  MAX_SURGE_POD_LABEL: 'The maximum available number of Pods',
  UPDATE_STRATEGY_DESC:
    'It\'s used to configure the strategy for replacing pods during the upgrade process. <a href="{link}" target="_blank">Learn more.</a>',
  MAX_UNAVAILABLE_DESC:
    'The maximum percentage of unavailable pods allowed during the upgrade process',
  MIN_AVAILABLE_POD_DESC:
    'The number of minimum Pods available for each RollingUpdate, is recommended to be a positive integer with a minimum of 1',
  MAX_SURGE_POD_DESC:
    'The maximum number of Pods allowed during a rolling upgrade',
  MIN_AVAILABLE_POD_VALIDATOR_MIN:
    'The number of minimum Pods available cannot be less than 1',
  MIN_AVAILABLE_POD_VALIDATOR_MAX:
    'The number of minimum Pods available cannot be greater than the current number of replicas',
  MAX_SURGE_POD_VALIDATOR_MIN:
    'The maximum number of Pods cannot be less than the number of replicas',
  MAX_SURGE_POD_VALIDATOR_MAX:
    'The maximum number of Pods cannot be greater than twice the current number of replicas',
  ROLLING_UPDATE_POD_TIP:
    'It limits the minimum and maximum available quantities based on the current replicas when it is in rolling update. The minimum number of replicas cannot exceed the current number of replicas, and the maximum number of Pods cannot exceed 2 times the current replicas.',
  ONDELETE_ALERT_TIP:
    'The controller will not automatically update the Pods and will update and replace the Pods instance when the Pods is manually deleted.',
  ROLLINGUPDATE_ALERT_TIP:
    'The RollingUpdate will gradually replace the old version of the instances with new ones. During the upgrade process, the traffic will be load balanced and distributed to the old and new instances simultaneously, so the service will not be interrupted.',
  RECREATE_ALERT_TIP:
    'All existing Pods will be killed before new ones are created, noted that the business will be interrupted during the update process.',

  STATEFULSET_PARTITION_DESC:
    'Partition indicates the ordinal at which the StatefulSet should be partitioned. Default value is 0.',
  STATEFULSET_PARTITION_PLACEHOLDER: 'Default value is 0',
  MIN_READY_SECONDS_DESC:
    'Specifies the minimum number of seconds for the pods of a daemonset startup',

  IMAGE_PLACEHOLDER:
    'Select the registry from dropdown list or enter a public registry address',
  IMAGE_REGISTRY_PLACEHOLDER: 'Select the registry secret',
  IMAGE_DESC:
    'To deploy from a private image repository, you need to <a href={link} target="_blank">create an image registry secret</a> first and then pull the image.',

  REPLICAS_DESC: 'The desired number of pods will be created for the {module}.',
  VOLUME_DESC:
    'A volume is a PVC (PersistentVolumeClaim) created using dynamic volume provisioning.',
  VOLUME_SUB_TEXT: 'Volumes used by the containers of the workload',
  EMPTYDIR_DESC: 'Temporary storage created for the workload',
  HOSTPATH_DESC:
    'A hostPath volume mounts a file or directory from the host node’s filesystem into your Pod.',
  PORT_INPUT_DESC:
    'The name is required and cannot be duplicated when there are multiple ports,',
  PORT_NAME_DESC:
    'The port name can only contain lowercase letters, numbers and hyphens("-"), and must begin with a lowercase letter, ending with a number or lowercase letter. The maximum length of characters is set to 63.',
  WORKLOAD_PORT_NAME_DESC:
    'The port name can only contain lowercase letters, numbers and hyphens("-"), and must begin with a lowercase letter, ending with a number or lowercase letter. The maximum length of characters is set to 15.',

  DEPLOYMENTS_BASEINFO_DESC:
    'You can give the deployment a name that is easy to distinguish when you use it.',
  DEPLOYMENT_POD_TEMPLATE_DESC:
    'The workload can automatically create a specified number of pods based on the Pod template and the number of replicas you set.',
  DEPLOYMENTS_VOLUME_DESC:
    'You can mount the same temporary storage volume or persistent storage volume to each copy of the deployed pods.',
  DEPLOYMENT_LABEL_SETTINGS_DESC:
    'The labels are one or more key-value pairs that are associated with a resource, such as a Pod. We usually identify, organize, or find resource objects through labels.',
  DEPLOYMENT_NODE_SELECT_DESC:
    "By using a selector to dispatch a Pod to a node that is expected to run, these selectors are one or more sets of key-value pairs that match the node's labels.",
  DEPLOYMENT_JOB_SETTINGS_DESC:
    'You can configure the Job Spec template, where the Job Controller is responsible for creating pods based on the Job Spec and keep monitoring the status of the Pod until it completes successfully. If it fails, the RestartPolicy (which supports OnFailure and Never) determines whether to create a new Pod and rerun the job.',
  DEPLOYMENT_CRONJOB_SETTINGS_DESC:
    'The CronJob settings is the part of template for the CronJob, it has exactly the same schema as a Job, where the Job Controller is responsible for creating pods based on the CronJob Spec and keep monitoring the status of the Pod until it completes successfully. If it fails, the RestartPolicy (which supports OnFailure and Never) determines whether to create a new Pod and rerun the CronJob.',

  STATEFULSETS_VOLUME_TEMPLATE_DESC:
    'Create a dedicated persistent volume for each Pod of the statefulset and mount it to the appropriate Pod',
  STATEFULSETS_ADD_VOLUME_TEMPLATE_DESC: 'Please add a volume template',
  STATEFULSETS_BASEINFO_DESC:
    'StatefulSet is used to manage stateful applications.',
  STATEFULSETS_SERVICE_CONFIG_DESC:
    "The cluster doesn't generate cluster IP for the service. In another word, a StatefulSet works with a headless service with selector. Therefore, the service is accessed internally through the service's endpoint IPs directly. StatefulSet is used for stateful applications such as master-slave serivces.",

  DAEMONSETS_BASEINFO_DESC:
    'The daemonset guarantees that a copy of the container is running on each host, often used to deploy logs, monitoring, or other system management applications for some clusters.',
  DAEMONSETS_VOLUME_DESC:
    'You can mount a HostPath, temporary volumes, or persistent volumes to a Pod of the daemonset.',

  JOBS_BASEINFO_DESC: '',
  JOBS_POD_TEMPLATE_DESC: 'Specify the Pod template to run in the job',
  JOBS_VOLUME_DESC:
    'You can mount a temporary volumes, or persistent volumes to a Pod of the job.',

  JOB_BACK_OFF_LIMIT_LABEL: 'Back off Limit',
  JOB_PARALLELISM_LABEL: 'Parallelism',
  JOB_COMPLETION_LABEL: 'Completions',
  JOB_ACTIVE_DL_SECONDS_LABEL: 'Active Deadline Seconds',

  JOB_BACK_OFF_LIMIT_DESC:
    'Specifies the number of retries before marking this job failed. Defaults to 6.',
  JOB_PARALLELISM_DESC:
    'Specifies the maximum desired number of pods the job should run at any given time.',
  JOB_COMPLETION_DESC:
    'Specifies the desired number of successfully finished pods the job should be run with.',
  JOB_ACTIVE_DL_SECONDS:
    'Specifies the duration in seconds relative to the startTime that the job may be active before the system tries to terminate it; value must be positive integer.',

  RESTART_POLICY_TIP:
    'RestartPolicy can only specify Never or OnFailure, when the job is not completed:<br/>* If RestartPolicy specifies Never, the job creates a new Pod when the Pod fails, and the failed Pod does not disappear.<br/>* If RestartPolicy specifies OnFailure, the job will internally restart the container when the Pod fails, instead of creating a new Pod.',

  RESTART_POLICY_NEVER_DESC: 'Create a new pod when a pod fails',
  RESTART_POLICY_ONFAILURE_DESC: 'Restart the container when a pod fails',

  CRONJOBS_BASEINFO_DESC:
    'Basic information regarding the CronJob. You need to specify the name and schedule',
  CRONJOBS_VOLUME_DESC:
    'You can mount a temporary volumes, or persistent volumes to a Pod of the cronjob.',
  CRONJOB_CRON_DESC:
    'It runs a job periodically on a given time-based schedule. See the <a href="//en.wikipedia.org/wiki/Cron" target="_blank">CRON</a> grammar reference',

  START_DEADLINE_SECONDS_DESC:
    'Optional deadline in seconds for starting the job if it misses scheduled time for any reason. ',

  VOLUME_EMPTY_TIP: 'No created volumes, please',

  HOST_PATH_DESC:
    'HostPath allows you to mount the file system on the host to the Pod. If the Pod needs to use files on the host, you can use HostPath.',
  SELECT_SECRET_DESC:
    'Select the key you want to use and the file path where each key will be exposed. The file path is relative to the mount path. The content of each file is the value of the key.',
  EMPTY_DIR_DESC:
    'Temporary volumes are assigned to the host along with the Pod. When a Pod is deleted from the host, the temporary volume is also deleted and the data of the volume is permanently deleted. <br /> Note: Deleting a container does not affect the temporary volume.',
  SELECT_VOLUME_TYPE_DESC: 'You can choose to an proper volume type to add',

  MOUNT_VOLUME_DESC:
    'For persistent storage volumes, select a volume that supports multi-node read-write mode (ROX or RWX). Otherwise, the pods update may fail because the pods are not on the same node. If you choose a single-node read-write (RWO) mode volume, you can also schedule the pods on the same node by node selection to avoid update errors.',

  CPU_REQUEST_TARGET_DESC:
    'Replicas will be increased when CPU usage exceeds this target value, on the contrary it will be decreased.',
  MEMORY_REQUEST_TARGET_DESC:
    'Replicas will be increased when memory usage exceeds this target value, on the contrary it will be decreased.',
  MIN_REPLICAS_DESC: 'Minimum value of the number of replicas',
  MAX_REPLICAS_DESC: 'Maximum value of the number of replicas',
  REPLICAS_PLACEHOLDER: 'Default: 1',

  ADD_VOLUME_TEMPLATE_DESC:
    'Add a volume template, the life cycle of the volume will be the same with the pod',

  EDIT: 'Edit',
  MORE: 'More',
  VIEW_YAML: 'View YAML',

  REVISION_ROLLBACK_SELECT: 'Please select the version to be rolled back',
  REVISION_TITLE: '{name} revision',
  PROBE_TIME: '{delay}s delay, {timeout}s timeout',
  INITIAL_DELAY_DESC:
    'Number of seconds after the container has started before liveness probes are initiated.',
  TIMEOUT_DESC:
    'Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1.',
  PERIOD_SECONDS_DESC:
    'How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1.',
  SUCCESS_THRESHOLD_DESC:
    'Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup. Minimum value is 1.',
  FAILURE_THRESHOLD_DESC:
    'Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.',

  HPA_MSG:
    'Automatically autoscale the replicas according to CPU and memory usage. If both CPU and memory are specified, the replicas is added or deleted after any of the conditions are met.',
  PROBE_MSG:
    'Readiness Probe检查容器是否准备好处理请求。失败意味着容器不应从代理接收任何流量，即使它正在运行。Liveness Probe检查配置它的容器是否仍在运行。如果活态探测器失败，则会杀死容器，容器将遵循其重启策略',
  WORKLOAD_REPLICA_MSG:
    'In the user-defined scope, if the number of Pods increases, the ReplicationController will terminate the extra Pods. Instead, the RC will create a new Pod that remains in the defined scope. For example, the RC will recreate the Pod on the node after Pod maintenance (such as kernel upgrades).',
  DEPLOYMENTS_REPLICA_DESC:
    "Deployment is used to describe a desired state that is expected to be reached by the application, it's mainly used to describe the stateless application. The number and state of replicas are maintained by the deployment controller, ensuring that the state is consistent with the defined expected state. You can increase the replicas to meet higher loads. Roll back the deployment version can eliminate bugs in the program, and create an autoscaler to flexibly handle the load in different scenarios.",
  STATEFULSETS_REPLICA_DESC:
    "StatefulSet is used to describe stateful application, for example, there are master-slave relationships between replicas, and data needs to be persisted. As with deployment, the replicas created by statefulsets are identical, except that each replica has a constant and unique identifier, and the identifier doesn't change even if the replica is rescheduled. You can use the statefulsets to achieve an orderly deployment, an orderly deletion, and an orderly rolling update for your application.",
  DAEMONSETS_REPLICA_DESC:
    'DaemonSet ensures that each node in the cluster runs a replica. When a node joins the cluster or leaves, the number of replicas is automatically adjusted to ensure that the number of replicas is the same as the number of nodes in the cluster. You can use the Daemonsets to run storage services such as glusterfs, ceph, etc. As well as running log collection services such as fluent, logstash, etc. and run monitoring services.',

  REFFER_CONFIGMAP_DESC: "Add a new volume from ConfigMap's value",
  REFFER_SECRET_DESC: "Add a new volume from Secret's value",

  MONITORING_ALERT_DESC:
    'The current monitoring graph only displays five replicas. You can click "View all replicas" to view more monitoring graphs if the number of replicas exceeds five.',

  RESOURCE_REQUESTS: 'Request',
  RESOURCE_LIMITS: 'Limit',
  CONTAINER_CPU_DESC:
    "It's used as the judgment of resource allocation when scheduling containers. The container is allowed to be scheduled to the node only if the total amount of CPU that can be allocated on the node is equal or greater than the request value of the container CPU.",
  CONTAINER_MEMORY_DESC:
    "It's used as the judgment of resource allocation when scheduling containers. The container is allowed to be scheduled to the node only if the total amount of memory that can be allocated on the node is equal or greater than the request value of the container memory.",
  IMAGE_PULL_POLICY_ALWAYS:
    'Pull the image every time the pod is started.（Always）',
  IMAGE_PULL_POLICY_IFNOTPRESENT:
    'Pull the image only if it is not already present locally（IfNotPresent）',
  IMAGE_PULL_POLICY_NEVER: 'Use local image（Never）',
  IMAGE_PULL_POLICY_ALWAYS_DESC: 'Pull the image every time the pod is started',
  IMAGE_PULL_POLICY_IFNOTPRESENT_DESC:
    'Pull the image only if it is not already present locally',
  IMAGE_PULL_POLICY_NEVER_DESC:
    'Only local image will be used, which will cause the container to be abnormal if the required image does not exist locally.',

  LIVENESS_PROBE_DESC:
    'This check method is used to detect if the container is alive.',
  READINESS_PROBE_DESC:
    'This check is used to detect if the container is ready to process requests.',
  STARTUP_PROBE_DESC:
    'StartupProbe indicates that the Pod has successfully initialized.',

  SEARCH_IMAGE_PLACEHOLDER: 'Enter keyword to search image',

  POD_CONDITION_INITIALIZED: 'Initialized',
  POD_CONDITION_INITIALIZED_DESC:
    'All init containers have started successfully',
  POD_CONDITION_READY: 'Ready',
  POD_CONDITION_READY_DESC:
    'The pod is already running and can be accessed through the service',
  POD_CONDITION_CONTAINERSREADY: 'ContainersReady',
  POD_CONDITION_CONTAINERSREADY_DESC: 'Containers in the pod is ready.',
  POD_CONDITION_PODSCHEDULED: 'PodScheduled',
  POD_CONDITION_PODSCHEDULED_DESC:
    'The pod has been successfully assigned to a node',
  POD_ASSIGNED_DESC:
    "The request value (ie, Request) set by the pod in the pod group is used as the basis for determining the resource allocation. Only when the amount that can be allocated in the node ≥ the pod's requst value, can the pod be allocated to this node.",
  POD_DESC:
    'Pod is a high-level abstraction for management and deployment. It is also a set of interfaces for Pods. Pods serve as unit of deployment, horizontal scaling, and replication.',
  POD_CREATE_DESC:
    'Pod is a high-level abstraction for management and deployment. It is also a set of interfaces for Pods. Pods serve as unit of deployment, horizontal scaling, and replication.',
  FILL_IMAGE_DEFAULT_PORTS_DESC:
    'Whether to expose the default port of the image?',

  REQUEST_EXCCED:
    'Resource requests should not be greater than resource limits',

  WORKLOAD_CONDITIONS: 'Conditions',
  WORKLOAD_CONDITION_AVAILABLE: 'Available',
  WORKLOAD_CONDITION_PROGRESSING: 'Progressing',

  COLLECT_SAVED_LOG_DESC:
    'You have enabled the option of collecting the logs on disk. Please add at least one volume and specify the directory in which the log is located.',

  PROJECT_COLLECT_SAVED_DISABLED_DESC:
    'Please contact project admin to open the file log collection at "Project Settings => Advanced Settings".',
  COLLECT_FILE_LOG_TIP:
    'When you add the PersistentVolumeClaim（PVC) (read & write mode), you can collect log information from the PVC. Once it  opens, the filebeat pod image, which can be used to collect relevant logs, will be installed through SideCar.',

  ISTIO_PROTOCOL_TIP:
    'In order to fully use the governance function, please select the protocol used for real services; for example, if the service is  revealed as HTTP, select http protocol. Then you can get http-[name] as your interface name.',

  CONTAINER_LOG_PATH_TIP:
    'The container log relative path is the path from the pod mount path, which can be given in glob mode. When there are multiple groups, separate them by commas. For example, when the pod mount path is /data, the pod log relative path is configured as log/*.log, which means that all .log suffix files in the /data/log directory are matched. If you need to match all .log suffix files in the /data/log directory and its subdirectories, you can configure the pod log relative path to log/**/*.log.',
  ADD_SUBPATH_TIP:
    "It's only appropriate for mounting volumes but not for hostpath",
  DELETE_WORKLOAD_DESC:
    'You are about to delete the workload(s) {resource}. Please confirm whether to delete the associated resource?',
  CHOOSE_EXIST_VOLUME_DESC:
    'Select a volume that has been created then mount it into the container.',

  REDEPLOY_CONFIRM_DESC:
    'You are about to redeploy the workload {resource} ({type}), the pod will be redeployed according to the update strategy, and your business may be temporarily interrupted.',

  CONTAINER_SECURITY_CTX_DESC:
    'A security context defines privilege and access control settings for a Pod or Container.',

  POD_SECURITY_CONTEXT_DESC:
    'Pod Security Context can provide default user and user group settings and seLinuxOptions parameter settings for containers in the pod. If these parameters have been defined in the container, the settings in the container take precedence.',

  ACCESS_CONTROL_PRIVILEGED: 'Privileged',
  ACCESS_CONTROL_PRIVILEGED_DESC:
    'At this point, the process in the container is essentially equivalent to the root user on the host node.',
  ACCESS_CONTROL_ALLOWPRIVILEGEESCALATION: 'AllowPrivilegeEscalation',
  ACCESS_CONTROL_ALLOWPRIVILEGEESCALATION_DESC:
    'Whether the process can acquire more privileges than the parent process. When running in privileged mode, it is enabled.',
  ACCESS_CONTROL_READONLYROOTFILESYSTEM: 'ReadOnlyRootFilesystem',
  ACCESS_CONTROL_READONLYROOTFILESYSTEM_DESC:
    "Whether the container's file system root path is read-only.",

  RUN_AS_NON_ROOT: 'Run as non root',
  RUN_AS_NON_ROOT_DESC:
    'kubernetes will perform a check before running the container to ensure that the container process is not running as the root user (UID 0), otherwise the container will not start.',
  RUN_AS_USER_DESC:
    'The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified.',
  RUN_AS_USER_GROUP_DESC:
    'The GID to run the entrypoint of the container process. Uses runtime default if unset.',
}

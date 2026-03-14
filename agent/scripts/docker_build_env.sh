#!/bin/bash
# docker_build_env.sh - Gerencia container Docker temporário para build de projetos
#
# Uso:
#   bash agent/scripts/docker_build_env.sh start <name> <image> <app_dir> <workdir> "<ports>" "<volumes>"
#   bash agent/scripts/docker_build_env.sh exec <name> "comando"
#   bash agent/scripts/docker_build_env.sh stop <name>
#   bash agent/scripts/docker_build_env.sh status <name>

set -e

ACTION="$1"
CONTAINER_NAME="$2"

case "$ACTION" in
  start)
    IMAGE="$3"
    APP_DIR="$4"
    WORKDIR="${5:-/workspace}"
    PORTS="$6"
    EXTRA_VOLUMES="$7"

    # Expand ~ in APP_DIR
    APP_DIR="${APP_DIR/#\~/$HOME}"

    if docker ps -q -f "name=^${CONTAINER_NAME}$" 2>/dev/null | grep -q .; then
      echo "Container '${CONTAINER_NAME}' already running."
      exit 0
    fi

    # Remove stopped container with same name if exists
    if docker ps -aq -f "name=^${CONTAINER_NAME}$" 2>/dev/null | grep -q .; then
      echo "Removing stopped container '${CONTAINER_NAME}'..."
      docker rm "${CONTAINER_NAME}" > /dev/null
    fi

    # Build docker run command
    CMD="docker run -d --name ${CONTAINER_NAME} -w ${WORKDIR}"

    # Mount app_dir as primary volume
    CMD="${CMD} -v ${APP_DIR}:${WORKDIR}"

    # Add extra volumes
    if [ -n "$EXTRA_VOLUMES" ] && [ "$EXTRA_VOLUMES" != "[]" ]; then
      for vol in $(echo "$EXTRA_VOLUMES" | tr -d '[]"' | tr ',' '\n'); do
        vol=$(echo "$vol" | xargs) # trim whitespace
        if [ -n "$vol" ] && [ "$vol" != "${APP_DIR}:${WORKDIR}" ]; then
          CMD="${CMD} -v ${vol}"
        fi
      done
    fi

    # Add ports
    if [ -n "$PORTS" ] && [ "$PORTS" != "[]" ]; then
      for port in $(echo "$PORTS" | tr -d '[]"' | tr ',' '\n'); do
        port=$(echo "$port" | xargs)
        if [ -n "$port" ]; then
          CMD="${CMD} -p ${port}"
        fi
      done
    fi

    # Keep container running with tail -f /dev/null
    CMD="${CMD} ${IMAGE} tail -f /dev/null"

    echo "Starting build container '${CONTAINER_NAME}' with image '${IMAGE}'..."
    echo "  Workspace: ${APP_DIR} -> ${WORKDIR}"
    eval $CMD

    if [ $? -eq 0 ]; then
      echo "Build container '${CONTAINER_NAME}' started successfully."
    else
      echo "ERROR: Failed to start container '${CONTAINER_NAME}'."
      exit 1
    fi
    ;;

  exec)
    COMMAND="$3"

    if [ -z "$COMMAND" ]; then
      echo "ERROR: No command provided."
      echo "Usage: bash docker_build_env.sh exec <name> \"command\""
      exit 1
    fi

    if ! docker ps -q -f "name=^${CONTAINER_NAME}$" 2>/dev/null | grep -q .; then
      echo "ERROR: Container '${CONTAINER_NAME}' is not running."
      exit 1
    fi

    docker exec "${CONTAINER_NAME}" bash -c "${COMMAND}"
    ;;

  stop)
    echo "Stopping and removing container '${CONTAINER_NAME}'..."

    if docker ps -q -f "name=^${CONTAINER_NAME}$" 2>/dev/null | grep -q .; then
      docker stop "${CONTAINER_NAME}" > /dev/null
    fi

    if docker ps -aq -f "name=^${CONTAINER_NAME}$" 2>/dev/null | grep -q .; then
      docker rm "${CONTAINER_NAME}" > /dev/null
    fi

    echo "Container '${CONTAINER_NAME}' removed."
    ;;

  status)
    if docker ps -q -f "name=^${CONTAINER_NAME}$" 2>/dev/null | grep -q .; then
      echo "RUNNING"
      docker ps -f "name=^${CONTAINER_NAME}$" --format "  Image: {{.Image}}\n  Status: {{.Status}}\n  Ports: {{.Ports}}"
    elif docker ps -aq -f "name=^${CONTAINER_NAME}$" 2>/dev/null | grep -q .; then
      echo "STOPPED"
    else
      echo "NOT_FOUND"
    fi
    ;;

  *)
    echo "Usage: bash docker_build_env.sh {start|exec|stop|status} <container_name> [args...]"
    echo ""
    echo "Commands:"
    echo "  start <name> <image> <app_dir> [workdir] [ports] [volumes]  - Start build container"
    echo "  exec  <name> \"command\"                                      - Run command in container"
    echo "  stop  <name>                                                 - Stop and remove container"
    echo "  status <name>                                                - Check container status"
    exit 1
    ;;
esac
